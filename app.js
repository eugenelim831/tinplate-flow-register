"use strict";

// The Worker address is fixed so ordinary users only need the application PIN.
// Change this value only if the Cloudflare Worker URL itself changes.
const API_URL = window.TINPLATE_API_URL || "https://tinplate-flow-api.eugenelim831-1b3.workers.dev";
const PIN_STORAGE_KEY = "movementAppPin";
const LOCATIONS = ["STORAGE", "PRINTING", "SLITTER", "PRODUCTION_LINE"];
const LOCATION_LABELS = {
  STORAGE: "Storage",
  PRINTING: "Printing",
  SLITTER: "Slitter",
  PRODUCTION_LINE: "Production Line"
};
const PURPOSE_LABELS = {
  CUSTOMER_BRAND: "Customer / Brand",
  COATING: "Coating",
  INTERNAL: "Stock / Internal"
};

const state = {
  lots: [],
  records: [],
  currentLocation: "STORAGE",
  selectedLotIds: new Set(),
  selectedRecord: null,
  signatureUrls: []
};

const $ = function (selector) { return document.querySelector(selector); };
const $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };

function showToast(message, error) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.className = "toast show" + (error ? " error" : "");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(function () { toast.className = "toast"; }, 4500);
}

function getPin() {
  return localStorage.getItem(PIN_STORAGE_KEY) || "";
}

async function api(path, options, pinOverride) {
  const settings = options || {};
  const headers = Object.assign(
    { "Content-Type": "application/json", "X-App-Pin": pinOverride == null ? getPin() : pinOverride },
    settings.headers || {}
  );
  const response = await fetch(API_URL.replace(/\/$/, "") + path, Object.assign({}, settings, { headers: headers }));
  const body = await response.json().catch(function () { return {}; });
  if (!response.ok) throw new Error(body.error || "Request failed (" + response.status + ").");
  return body;
}

async function apiBlob(path) {
  const response = await fetch(API_URL.replace(/\/$/, "") + path, {
    headers: { "X-App-Pin": getPin() }
  });
  if (!response.ok) {
    const body = await response.json().catch(function () { return {}; });
    throw new Error(body.error || "Unable to load signature.");
  }
  return response.blob();
}

function setLoggedIn(loggedIn) {
  $("#loginScreen").classList.toggle("hidden", loggedIn);
  $("#appShell").classList.toggle("hidden", !loggedIn);
  if (!loggedIn) {
    $("#loginPin").value = "";
    setTimeout(function () { $("#loginPin").focus(); }, 50);
  }
}

async function authenticate(pin, quiet) {
  const button = $("#loginButton");
  button.disabled = true;
  button.textContent = "Checking…";
  try {
    await api("/health", { method: "GET" }, pin);
    localStorage.setItem(PIN_STORAGE_KEY, pin);
    setLoggedIn(true);
    await Promise.all([loadInventory(), loadRecords(false)]);
    if (!quiet) showToast("Logged in successfully.");
    return true;
  } catch (error) {
    localStorage.removeItem(PIN_STORAGE_KEY);
    setLoggedIn(false);
    if (!quiet) showToast(error.message, true);
    return false;
  } finally {
    button.disabled = false;
    button.textContent = "Log In";
  }
}

$("#loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  authenticate($("#loginPin").value, false);
});

$("#logoutButton").addEventListener("click", function () {
  localStorage.removeItem(PIN_STORAGE_KEY);
  state.lots = [];
  state.records = [];
  state.selectedLotIds.clear();
  setLoggedIn(false);
  showToast("Logged out.");
});

function setupSignature(canvas) {
  const context = canvas.getContext("2d");
  let drawing = false;
  let hasInk = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const saved = hasInk ? canvas.toDataURL("image/png") : "";
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineWidth = 2.2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#18312b";
    if (saved) {
      const image = new Image();
      image.onload = function () { context.drawImage(image, 0, 0, rect.width, rect.height); };
      image.src = saved;
    }
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener("pointerdown", function (event) {
    drawing = true;
    hasInk = true;
    canvas.setPointerCapture(event.pointerId);
    const p = point(event);
    context.beginPath();
    context.moveTo(p.x, p.y);
  });
  canvas.addEventListener("pointermove", function (event) {
    if (!drawing) return;
    const p = point(event);
    context.lineTo(p.x, p.y);
    context.stroke();
  });
  canvas.addEventListener("pointerup", function () { drawing = false; });
  canvas.addEventListener("pointercancel", function () { drawing = false; });
  canvas.clearSignature = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    hasInk = false;
  };
  canvas.signatureData = function () { return hasInk ? canvas.toDataURL("image/png") : ""; };
  canvas.prepareSignature = function () { requestAnimationFrame(resize); };
  new ResizeObserver(resize).observe(canvas);
}

$$(".signature").forEach(setupSignature);
$$(".clear-signature").forEach(function (button) {
  button.addEventListener("click", function () {
    document.getElementById(button.dataset.canvas).clearSignature();
  });
});

$$(".close-dialog").forEach(function (button) {
  button.addEventListener("click", function () { button.closest("dialog").close(); });
});

$("#recordDialog").addEventListener("close", revokeSignatureUrls);

function revokeSignatureUrls() {
  state.signatureUrls.forEach(function (url) { URL.revokeObjectURL(url); });
  state.signatureUrls = [];
}

function activateLocation(location) {
  state.currentLocation = location;
  state.selectedLotIds.clear();
  $$(".tab").forEach(function (button) {
    button.classList.toggle("active", button.dataset.location === location);
  });
  $("#inventoryPanel").classList.add("active");
  $("#recordsPanel").classList.remove("active");
  $("#locationTitle").textContent = LOCATION_LABELS[location];
  $("#slitSelected").classList.toggle("hidden", location !== "SLITTER");
  renderInventory();
}

$$(".tab[data-location]").forEach(function (button) {
  button.addEventListener("click", function () { activateLocation(button.dataset.location); });
});

$(".tab[data-view='records']").addEventListener("click", function (event) {
  $$(".tab").forEach(function (button) { button.classList.toggle("active", button === event.currentTarget); });
  $("#inventoryPanel").classList.remove("active");
  $("#recordsPanel").classList.add("active");
  loadRecords(true);
});

async function loadInventory() {
  $("#inventoryBody").innerHTML = '<tr><td colspan="8" class="empty-cell">Loading current stock…</td></tr>';
  try {
    const result = await api("/inventory");
    state.lots = Array.isArray(result.lots) ? result.lots : [];
    removeInvalidSelections();
    renderInventory();
  } catch (error) {
    $("#inventoryBody").innerHTML = '<tr><td colspan="8" class="empty-cell">' + escapeHtml(error.message) + '</td></tr>';
    showToast(error.message, true);
  }
}

function removeInvalidSelections() {
  const valid = new Set(state.lots.filter(function (lot) {
    return lot.location === state.currentLocation && Number(lot.quantity) > 0;
  }).map(function (lot) { return lot.lotId; }));
  Array.from(state.selectedLotIds).forEach(function (id) {
    if (!valid.has(id)) state.selectedLotIds.delete(id);
  });
}

function currentLocationLots() {
  return state.lots.filter(function (lot) {
    return lot.location === state.currentLocation && Number(lot.quantity) > 0;
  });
}

function filteredLots() {
  const term = $("#inventorySearch").value.trim().toLowerCase();
  const unit = $("#inventoryUnitFilter").value;
  return currentLocationLots().filter(function (lot) {
    const text = [
      lot.lotId, lot.batchNumber, lot.dimensions, lot.customer, lot.brand,
      lot.description, lot.coatingDescription
    ].join(" ").toLowerCase();
    return (!term || text.includes(term)) && (!unit || lot.unit === unit);
  });
}

function renderInventory() {
  const all = currentLocationLots();
  const lots = filteredLots();
  $("#lotCount").textContent = formatNumber(all.length);
  $("#sheetCount").textContent = formatNumber(sumUnit(all, "SHEETS"));
  $("#blankCount").textContent = formatNumber(sumUnit(all, "BLANKS"));
  $("#selectedCount").textContent = formatNumber(state.selectedLotIds.size);
  $("#openingStockNotice").classList.toggle("hidden", state.lots.length !== 0);

  if (!lots.length) {
    const message = state.lots.length ? "No stock matches this location and filter." : "No opening stock has been loaded.";
    $("#inventoryBody").innerHTML = '<tr><td colspan="8" class="empty-cell">' + message + '</td></tr>';
  } else {
    $("#inventoryBody").innerHTML = lots.map(function (lot) {
      const customerBrand = [lot.customer, lot.brand].filter(Boolean).join(" / ") || "—";
      const description = [lot.description, lot.coatingDescription].filter(Boolean).join(" · ") || "—";
      return '<tr>' +
        '<td class="select-column"><input class="lot-checkbox" type="checkbox" data-lot-id="' + escapeHtml(lot.lotId) + '"' +
          (state.selectedLotIds.has(lot.lotId) ? " checked" : "") + ' aria-label="Select ' + escapeHtml(lot.lotId) + '"></td>' +
        '<td><strong>' + escapeHtml(lot.lotId) + '</strong></td>' +
        '<td>' + escapeHtml(lot.batchNumber) + '</td>' +
        '<td>' + escapeHtml(lot.dimensions) + '</td>' +
        '<td class="quantity-cell"><strong>' + formatNumber(lot.quantity) + '</strong><span>' + unitLabel(lot.unit) + '</span></td>' +
        '<td class="description-cell">' + escapeHtml(customerBrand) + '</td>' +
        '<td class="description-cell">' + escapeHtml(description) + '</td>' +
        '<td>' + formatDate(lot.updatedAt) + '</td>' +
      '</tr>';
    }).join("");
    $$("#inventoryBody .lot-checkbox").forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) state.selectedLotIds.add(checkbox.dataset.lotId);
        else state.selectedLotIds.delete(checkbox.dataset.lotId);
        updateSelectionControls();
      });
    });
  }
  updateSelectionControls();
}

function updateSelectionControls() {
  const selected = selectedLots();
  $("#selectedCount").textContent = formatNumber(selected.length);
  $("#transferSelected").disabled = selected.length === 0;
  $("#slitSelected").disabled = selected.length !== 1 || selected[0].unit !== "SHEETS";
}

function selectedLots() {
  return state.lots.filter(function (lot) { return state.selectedLotIds.has(lot.lotId); });
}

function sumUnit(lots, unit) {
  return lots.filter(function (lot) { return lot.unit === unit; }).reduce(function (total, lot) {
    return total + Number(lot.quantity || 0);
  }, 0);
}

$("#refreshInventory").addEventListener("click", loadInventory);
$("#inventorySearch").addEventListener("input", renderInventory);
$("#inventoryUnitFilter").addEventListener("change", renderInventory);

function purposeFieldsHtml() {
  return '<div class="form-grid purpose-block">' +
    '<label>Purpose type<select class="purpose-type" required>' +
      '<option value="CUSTOMER_BRAND">Customer / Brand</option>' +
      '<option value="COATING">Coating</option>' +
      '<option value="INTERNAL">Stock / Internal</option>' +
    '</select></label>' +
    '<label class="purpose-customer">Customer<input class="customer" maxlength="160" required placeholder="Customer name"></label>' +
    '<label class="purpose-brand">Brand / design<input class="brand" maxlength="160" required placeholder="Brand or printed design"></label>' +
    '<label class="purpose-coating hidden">Coating description<input class="coating-description" maxlength="240" placeholder="e.g. White coat or epoxy gold"></label>' +
  '</div>';
}

function setupPurposeFields(container) {
  container.innerHTML = purposeFieldsHtml();
  const select = container.querySelector(".purpose-type");
  select.addEventListener("change", function () { updatePurposeFields(container); });
  updatePurposeFields(container);
}

function updatePurposeFields(container) {
  const type = container.querySelector(".purpose-type").value;
  const customerLabel = container.querySelector(".purpose-customer");
  const brandLabel = container.querySelector(".purpose-brand");
  const coatingLabel = container.querySelector(".purpose-coating");
  customerLabel.classList.toggle("hidden", type !== "CUSTOMER_BRAND");
  brandLabel.classList.toggle("hidden", type !== "CUSTOMER_BRAND");
  coatingLabel.classList.toggle("hidden", type !== "COATING");
  container.querySelector(".customer").required = type === "CUSTOMER_BRAND";
  container.querySelector(".brand").required = type === "CUSTOMER_BRAND";
  container.querySelector(".coating-description").required = type === "COATING";
}

function collectPurpose(container) {
  const type = container.querySelector(".purpose-type").value;
  const purpose = {
    type: type,
    customer: container.querySelector(".customer").value.trim(),
    brand: container.querySelector(".brand").value.trim(),
    coatingDescription: container.querySelector(".coating-description").value.trim()
  };
  if (type === "CUSTOMER_BRAND" && (!purpose.customer || !purpose.brand)) {
    throw new Error("Customer and brand / design are required for customer work.");
  }
  if (type === "COATING" && !purpose.coatingDescription) {
    throw new Error("Enter the coating description.");
  }
  if (type !== "CUSTOMER_BRAND") {
    purpose.customer = "";
    purpose.brand = "";
  }
  if (type !== "COATING") purpose.coatingDescription = "";
  return purpose;
}

$("#transferSelected").addEventListener("click", openTransferDialog);

function openTransferDialog() {
  const lots = selectedLots();
  if (!lots.length) return showToast("Select at least one stock lot.", true);
  $("#transferForm").reset();
  $("#transferSignature").clearSignature();
  $("#transferFromLabel").value = LOCATION_LABELS[state.currentLocation];
  $("#transferDestination").innerHTML = LOCATIONS.filter(function (location) {
    return location !== state.currentLocation;
  }).map(function (location) {
    return '<option value="' + location + '">' + LOCATION_LABELS[location] + '</option>';
  }).join("");
  $("#transferItems").innerHTML = lots.map(function (lot, index) {
    return '<article class="item-card transfer-item" data-lot-id="' + escapeHtml(lot.lotId) + '">' +
      '<div class="item-card-head"><strong>Item ' + (index + 1) + ' — ' + escapeHtml(lot.lotId) + '</strong></div>' +
      stockSnapshotHtml(lot) +
      '<label>Quantity to transfer (' + unitLabel(lot.unit).toLowerCase() + ')' +
        '<input class="transfer-quantity" type="number" inputmode="numeric" min="1" max="' + Number(lot.quantity) + '" step="1" value="' + Number(lot.quantity) + '" required>' +
      '</label>' +
    '</article>';
  }).join("");
  setupPurposeFields($("#transferPurposeFields"));
  $("#transferDialog").showModal();
  $("#transferSignature").prepareSignature();
}

function stockSnapshotHtml(lot) {
  return '<div class="stock-snapshot">' +
    '<div><span>Batch</span><strong>' + escapeHtml(lot.batchNumber) + '</strong></div>' +
    '<div><span>Dimensions</span><strong>' + escapeHtml(lot.dimensions) + '</strong></div>' +
    '<div><span>Available</span><strong>' + formatNumber(lot.quantity) + ' ' + unitLabel(lot.unit) + '</strong></div>' +
    '<div><span>Location</span><strong>' + escapeHtml(LOCATION_LABELS[lot.location] || lot.location) + '</strong></div>' +
  '</div>';
}

$("#transferForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  const signature = $("#transferSignature").signatureData();
  if (!signature) return showToast("PIC signature is required.", true);
  let purpose;
  let items;
  try {
    purpose = collectPurpose($("#transferPurposeFields"));
    items = $$("#transferItems .transfer-item").map(function (card, index) {
      const lot = state.lots.find(function (candidate) { return candidate.lotId === card.dataset.lotId; });
      const quantity = Number(card.querySelector(".transfer-quantity").value);
      if (!lot) throw new Error("Selected stock is no longer available. Refresh and try again.");
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Item " + (index + 1) + ": quantity must be a whole number.");
      if (quantity > Number(lot.quantity)) throw new Error("Item " + (index + 1) + ": quantity exceeds the available balance.");
      return { sourceLotId: lot.lotId, quantity: quantity };
    });
  } catch (error) {
    return showToast(error.message, true);
  }

  const payload = {
    type: "TRANSFER",
    sourceLocation: state.currentLocation,
    destinationLocation: $("#transferDestination").value,
    items: items,
    purpose: purpose,
    description: $("#transferDescription").value.trim(),
    picName: $("#transferPic").value.trim(),
    signature: signature
  };
  await submitMovement($("#submitTransfer"), payload, $("#transferDialog"), "Post Transfer");
});

async function submitMovement(button, payload, dialog, idleText) {
  button.disabled = true;
  button.textContent = "Posting…";
  try {
    const result = await api("/records", { method: "POST", body: JSON.stringify(payload) });
    dialog.close();
    state.selectedLotIds.clear();
    showToast("Record " + result.record.id + " posted.");
    await Promise.all([loadInventory(), loadRecords(false)]);
  } catch (error) {
    showToast(error.message, true);
  } finally {
    button.disabled = false;
    button.textContent = idleText;
  }
}

$("#slitSelected").addEventListener("click", openSlittingDialog);
$("#addBlankOutput").addEventListener("click", function () { addBlankOutput(); });
$("#sheetsConsumed").addEventListener("input", updateSlittingCalculations);

function openSlittingDialog() {
  const lots = selectedLots();
  if (state.currentLocation !== "SLITTER" || lots.length !== 1 || lots[0].unit !== "SHEETS") {
    return showToast("Select exactly one sheet stock lot from the Slitter tab.", true);
  }
  const lot = lots[0];
  $("#slittingForm").reset();
  $("#slittingSignature").clearSignature();
  $("#slittingSource").dataset.lotId = lot.lotId;
  $("#slittingSource").innerHTML = '<h3>' + escapeHtml(lot.lotId) + '</h3>' + stockSnapshotHtml(lot);
  $("#sheetsConsumed").max = Number(lot.quantity);
  $("#sheetsConsumed").value = "";
  $("#sourceBalanceAfter").value = formatNumber(lot.quantity) + " sheets";
  $("#blankOutputs").innerHTML = "";
  addBlankOutput();
  setupPurposeFields($("#slittingPurposeFields"));
  $("#areaCheck").className = "info-banner";
  $("#areaCheck").textContent = "Enter the sheets consumed and blank outputs to check material area.";
  $("#slittingDialog").showModal();
  $("#slittingSignature").prepareSignature();
}

function addBlankOutput(initial) {
  const fragment = $("#blankOutputTemplate").content.cloneNode(true);
  const card = fragment.querySelector(".blank-output");
  $("#blankOutputs").appendChild(fragment);
  if (initial) {
    card.querySelector(".blank-width").value = initial.width || "";
    card.querySelector(".blank-length").value = initial.length || "";
    card.querySelector(".blank-quantity").value = initial.quantity || "";
  }
  card.querySelector(".remove-output").addEventListener("click", function () {
    card.remove();
    renumberBlankOutputs();
    updateSlittingCalculations();
  });
  card.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("input", updateSlittingCalculations);
  });
  renumberBlankOutputs();
  updateSlittingCalculations();
}

function renumberBlankOutputs() {
  const cards = $$("#blankOutputs .blank-output");
  cards.forEach(function (card, index) {
    card.querySelector(".item-number").textContent = "Blank size " + (index + 1);
    card.querySelector(".remove-output").disabled = cards.length === 1;
  });
}

function selectedSlittingLot() {
  return state.lots.find(function (lot) { return lot.lotId === $("#slittingSource").dataset.lotId; });
}

function updateSlittingCalculations() {
  const lot = selectedSlittingLot();
  if (!lot) return;
  const parts = parseDimensions(lot.dimensions);
  const consumed = Number($("#sheetsConsumed").value || 0);
  $("#sourceBalanceAfter").value = formatNumber(Math.max(0, Number(lot.quantity) - consumed)) + " sheets";

  let outputArea = 0;
  let complete = consumed > 0;
  $$("#blankOutputs .blank-output").forEach(function (card) {
    const width = Number(card.querySelector(".blank-width").value || 0);
    const length = Number(card.querySelector(".blank-length").value || 0);
    const quantity = Number(card.querySelector(".blank-quantity").value || 0);
    card.querySelector(".blank-dimensions").value = width && length && parts
      ? parts.thickness + "*" + width + "*" + length
      : "";
    if (!width || !length || !quantity) complete = false;
    outputArea += width * length * quantity;
  });

  if (!parts || !complete) {
    $("#areaCheck").className = "info-banner";
    $("#areaCheck").textContent = "Enter the sheets consumed and every blank output to check material area.";
    return;
  }
  const inputArea = parts.width * parts.length * consumed;
  const utilization = inputArea ? (outputArea / inputArea) * 100 : 0;
  const exceeded = outputArea > inputArea;
  $("#areaCheck").className = "info-banner" + (exceeded ? " error" : "");
  $("#areaCheck").textContent = exceeded
    ? "Blank output area exceeds the consumed sheet area. Correct the quantities or dimensions."
    : "Recorded blank area uses " + utilization.toFixed(1) + "% of the consumed sheet area.";
}

$("#slittingForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  const lot = selectedSlittingLot();
  if (!lot) return showToast("The selected sheet stock is no longer available.", true);
  const signature = $("#slittingSignature").signatureData();
  if (!signature) return showToast("PIC signature is required.", true);

  let purpose;
  let outputs;
  const sheetsConsumed = Number($("#sheetsConsumed").value);
  try {
    purpose = collectPurpose($("#slittingPurposeFields"));
    if (!Number.isInteger(sheetsConsumed) || sheetsConsumed < 1) throw new Error("Sheets consumed must be a whole number.");
    if (sheetsConsumed > Number(lot.quantity)) throw new Error("Sheets consumed exceed the available balance.");
    outputs = $$("#blankOutputs .blank-output").map(function (card, index) {
      const width = Number(card.querySelector(".blank-width").value);
      const length = Number(card.querySelector(".blank-length").value);
      const quantity = Number(card.querySelector(".blank-quantity").value);
      if (![width, length, quantity].every(function (value) { return Number.isInteger(value) && value > 0; })) {
        throw new Error("Blank size " + (index + 1) + ": width, length and quantity must be positive whole numbers.");
      }
      return { width: width, length: length, quantity: quantity };
    });
    const dimensions = parseDimensions(lot.dimensions);
    const inputArea = dimensions.width * dimensions.length * sheetsConsumed;
    const outputArea = outputs.reduce(function (total, output) {
      return total + output.width * output.length * output.quantity;
    }, 0);
    if (outputArea > inputArea) throw new Error("Blank output area cannot exceed the consumed sheet area.");
  } catch (error) {
    return showToast(error.message, true);
  }

  const payload = {
    type: "SLITTING",
    sourceLocation: "SLITTER",
    sourceLotId: lot.lotId,
    sheetsConsumed: sheetsConsumed,
    outputs: outputs,
    purpose: purpose,
    description: $("#slittingDescription").value.trim(),
    picName: $("#slittingPic").value.trim(),
    signature: signature
  };
  await submitMovement($("#submitSlitting"), payload, $("#slittingDialog"), "Post Slitting Record");
});

async function loadRecords(showErrors) {
  if (showErrors) $("#recordsBody").innerHTML = '<tr><td colspan="10" class="empty-cell">Loading records…</td></tr>';
  try {
    const result = await api("/records");
    state.records = Array.isArray(result.records) ? result.records : [];
    renderRecords();
  } catch (error) {
    if (showErrors) {
      $("#recordsBody").innerHTML = '<tr><td colspan="10" class="empty-cell">' + escapeHtml(error.message) + '</td></tr>';
      showToast(error.message, true);
    }
  }
}

function filteredRecords() {
  const term = $("#recordSearch").value.trim().toLowerCase();
  const type = $("#recordTypeFilter").value;
  const status = $("#recordStatusFilter").value;
  return state.records.filter(function (record) {
    const text = [
      record.id, record.type, record.sourceLocation, record.destinationLocation,
      record.picName, record.description, record.purpose && record.purpose.customer,
      record.purpose && record.purpose.brand, record.purpose && record.purpose.coatingDescription
    ].concat((record.lines || []).reduce(function (values, line) {
      return values.concat([line.sourceLotId, line.destinationLotId, line.lotId, line.batchNumber, line.dimensions]);
    }, [])).join(" ").toLowerCase();
    return (!term || text.includes(term)) && (!type || record.type === type) && (!status || record.status === status);
  });
}

function renderRecords() {
  const records = filteredRecords();
  if (!records.length) {
    $("#recordsBody").innerHTML = '<tr><td colspan="10" class="empty-cell">No matching movement records.</td></tr>';
    return;
  }
  $("#recordsBody").innerHTML = records.map(function (record) {
    const destination = record.type === "SLITTING" ? "Slitting conversion" : locationLabel(record.destinationLocation);
    const purpose = purposeSummary(record.purpose);
    return '<tr>' +
      '<td><strong>' + escapeHtml(record.id) + '</strong></td>' +
      '<td>' + (record.type === "SLITTING" ? "Slitting" : "Transfer") + '</td>' +
      '<td>' + escapeHtml(locationLabel(record.sourceLocation)) + '</td>' +
      '<td>' + escapeHtml(destination) + '</td>' +
      '<td>' + formatNumber((record.lines || []).length) + '</td>' +
      '<td class="description-cell">' + escapeHtml(purpose) + '</td>' +
      '<td>' + escapeHtml(record.picName) + '</td>' +
      '<td>' + formatDate(record.createdAt) + '</td>' +
      '<td class="status-cell ' + escapeHtml(record.status) + '">' + titleCase(record.status) + '</td>' +
      '<td><button class="secondary table-action view-record" type="button" data-record-id="' + escapeHtml(record.id) + '">View</button></td>' +
    '</tr>';
  }).join("");
  $$("#recordsBody .view-record").forEach(function (button) {
    button.addEventListener("click", function () { openRecord(button.dataset.recordId); });
  });
}

$("#refreshRecords").addEventListener("click", function () { loadRecords(true); });
$("#recordSearch").addEventListener("input", renderRecords);
$("#recordTypeFilter").addEventListener("change", renderRecords);
$("#recordStatusFilter").addEventListener("change", renderRecords);

async function openRecord(id) {
  revokeSignatureUrls();
  $("#recordDialogTitle").textContent = id;
  $("#recordDetail").innerHTML = '<p class="empty-cell">Loading record…</p>';
  $("#cancelSection").classList.add("hidden");
  $("#recordDialog").showModal();
  try {
    const record = await api("/records/" + encodeURIComponent(id));
    state.selectedRecord = record;
    renderRecordDetail(record);
    $("#cancelSection").classList.toggle("hidden", record.status !== "POSTED");
    $("#cancelForm").reset();
    $("#cancelSignature").clearSignature();
    $("#cancelSignature").prepareSignature();
    loadRecordSignatures(record);
  } catch (error) {
    $("#recordDetail").innerHTML = '<p class="info-banner error">' + escapeHtml(error.message) + '</p>';
  }
}

function renderRecordDetail(record) {
  const destination = record.type === "SLITTING" ? "Slitting conversion" : locationLabel(record.destinationLocation);
  let html = '<dl class="detail-grid">' +
    detailCell("Record ID", record.id) +
    detailCell("Type", record.type === "SLITTING" ? "Slitting" : "Transfer") +
    detailCell("Status", titleCase(record.status)) +
    detailCell("From", locationLabel(record.sourceLocation)) +
    detailCell("To / Process", destination) +
    detailCell("Worker date & time", formatDate(record.createdAt)) +
    detailCell("PIC", record.picName) +
    detailCell("Purpose", purposeSummary(record.purpose)) +
    detailCell("Description", record.description) +
  '</dl>';

  if (record.type === "TRANSFER") {
    html += '<section class="record-items"><h3>Transferred stock</h3><div class="table-wrap"><table><thead><tr>' +
      '<th>Source stock ID</th><th>Destination stock ID</th><th>Batch</th><th>Dimensions</th><th>Quantity</th>' +
      '</tr></thead><tbody>' +
      record.items.map(function (item) {
        return '<tr><td>' + escapeHtml(item.sourceLotId) + '</td><td>' + escapeHtml(item.destinationLotId) +
          '</td><td>' + escapeHtml(item.batchNumber) + '</td><td>' + escapeHtml(item.dimensions) +
          '</td><td>' + formatNumber(item.quantity) + ' ' + escapeHtml(unitLabel(item.unit)) + '</td></tr>';
      }).join("") + '</tbody></table></div></section>';
  } else {
    html += '<section class="record-items"><h3>Source sheets consumed</h3><div class="record-summary">' +
      stockSnapshotHtml({
        batchNumber: record.source.batchNumber,
        dimensions: record.source.dimensions,
        quantity: record.source.quantity,
        unit: record.source.unit,
        location: record.sourceLocation
      }) + '<strong>Source stock ID: ' + escapeHtml(record.source.sourceLotId) + '</strong></div>' +
      '<h3>Blank outputs</h3><div class="table-wrap"><table><thead><tr><th>New stock ID</th><th>Batch</th><th>Dimensions</th><th>Quantity</th></tr></thead><tbody>' +
      record.outputs.map(function (output) {
        return '<tr><td>' + escapeHtml(output.lotId) + '</td><td>' + escapeHtml(output.batchNumber) +
          '</td><td>' + escapeHtml(output.dimensions) + '</td><td>' + formatNumber(output.quantity) + ' Blanks</td></tr>';
      }).join("") + '</tbody></table></div></section>';
  }

  html += '<section class="record-items"><h3>Audit trail</h3>' +
    (record.audit || []).map(function (entry, index) {
      const cancelled = entry.action === "CANCELLED";
      return '<article class="audit-entry' + (cancelled ? " cancelled" : "") + '">' +
        '<strong>' + escapeHtml(titleCase(entry.action)) + '</strong>' +
        '<p>' + escapeHtml(entry.by) + ' · ' + formatDate(entry.at) + '</p>' +
        (entry.reason ? '<p><strong>Reason:</strong> ' + escapeHtml(entry.reason) + '</p>' : '') +
        '<div class="signature-slot" data-signature-index="' + index + '"><span>Loading signature…</span></div>' +
      '</article>';
    }).join("") + '</section>';
  $("#recordDetail").innerHTML = html;
}

async function loadRecordSignatures(record) {
  (record.audit || []).forEach(async function (entry, index) {
    const slot = $("#recordDetail .signature-slot[data-signature-index='" + index + "']");
    if (!slot || !entry.signaturePath) return;
    try {
      const blob = await apiBlob("/signatures/" + encodeURIComponent(entry.signaturePath.split("/").pop()));
      const url = URL.createObjectURL(blob);
      state.signatureUrls.push(url);
      slot.innerHTML = '<img class="signature-preview" alt="' + escapeHtml(titleCase(entry.action)) + ' PIC signature">';
      slot.querySelector("img").src = url;
    } catch (error) {
      slot.textContent = "Signature unavailable: " + error.message;
    }
  });
}

$("#cancelForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  if (!state.selectedRecord || state.selectedRecord.status !== "POSTED") {
    return showToast("Only a posted record can be cancelled.", true);
  }
  const signature = $("#cancelSignature").signatureData();
  if (!signature) return showToast("Cancellation signature is required.", true);
  const payload = {
    reason: $("#cancelReason").value.trim(),
    picName: $("#cancelPic").value.trim(),
    signature: signature
  };
  const button = $("#submitCancellation");
  button.disabled = true;
  button.textContent = "Reversing…";
  try {
    const result = await api("/records/" + encodeURIComponent(state.selectedRecord.id) + "/cancel", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    $("#recordDialog").close();
    showToast("Record " + result.record.id + " cancelled and reversed.");
    state.selectedRecord = null;
    state.selectedLotIds.clear();
    await Promise.all([loadInventory(), loadRecords(false)]);
  } catch (error) {
    showToast(error.message, true);
  } finally {
    button.disabled = false;
    button.textContent = "Cancel and Reverse Record";
  }
});

$("#exportCsv").addEventListener("click", function () {
  const records = filteredRecords();
  if (!records.length) return showToast("There are no matching records to export.", true);
  const headings = [
    "Record ID", "Type", "Status", "Worker Date Time", "From", "To / Process", "PIC",
    "Purpose Type", "Customer", "Brand / Design", "Coating Description", "Movement Description",
    "Source Stock ID", "Destination / Output Stock ID", "Batch Number", "Dimensions", "Quantity", "Unit"
  ];
  const rows = [headings];
  records.forEach(function (record) {
    const lines = record.lines && record.lines.length ? record.lines : [{}];
    lines.forEach(function (line) {
      rows.push([
        record.id,
        record.type,
        record.status,
        record.createdAt,
        locationLabel(record.sourceLocation),
        record.type === "SLITTING" ? "Slitting conversion" : locationLabel(record.destinationLocation),
        record.picName,
        record.purpose && PURPOSE_LABELS[record.purpose.type],
        record.purpose && record.purpose.customer,
        record.purpose && record.purpose.brand,
        record.purpose && record.purpose.coatingDescription,
        record.description,
        line.sourceLotId || record.sourceLotId || "",
        line.destinationLotId || line.lotId || "",
        line.batchNumber || "",
        line.dimensions || "",
        line.quantity == null ? "" : line.quantity,
        line.unit || ""
      ]);
    });
  });
  const csv = rows.map(function (row) {
    return row.map(function (value) {
      return '"' + String(value == null ? "" : value).replaceAll('"', '""') + '"';
    }).join(",");
  }).join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = "tinplate-movement-records-" + new Date().toISOString().slice(0, 10) + ".csv";
  link.click();
  setTimeout(function () { URL.revokeObjectURL(link.href); }, 0);
});

function parseDimensions(value) {
  const match = String(value || "").match(/^(0\.\d+)\*(\d+)\*(\d+)$/);
  if (!match) return null;
  return { thickness: match[1], width: Number(match[2]), length: Number(match[3]) };
}

function purposeSummary(purpose) {
  if (!purpose) return "—";
  if (purpose.type === "CUSTOMER_BRAND") return [purpose.customer, purpose.brand].filter(Boolean).join(" / ") || "Customer / Brand";
  if (purpose.type === "COATING") return purpose.coatingDescription || "Coating";
  return "Stock / Internal";
}

function detailCell(label, value) {
  return '<div><dt>' + escapeHtml(label) + '</dt><dd>' + escapeHtml(value || "—") + '</dd></div>';
}

function locationLabel(location) {
  return LOCATION_LABELS[location] || location || "—";
}

function unitLabel(unit) {
  return unit === "SHEETS" ? "Sheets" : unit === "BLANKS" ? "Blanks" : titleCase(unit);
}

function titleCase(value) {
  return String(value || "").toLowerCase().replaceAll("_", " ").replace(/\b\w/g, function (character) {
    return character.toUpperCase();
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-MY", { maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
  });
}

(async function boot() {
  setupPurposeFields($("#transferPurposeFields"));
  setupPurposeFields($("#slittingPurposeFields"));
  const savedPin = getPin();
  if (savedPin) {
    const success = await authenticate(savedPin, true);
    if (!success) showToast("Saved login is no longer valid. Enter the application PIN.", true);
  } else {
    setLoggedIn(false);
  }
})();
