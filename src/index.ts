import "./style.css";
import { Coordinate, getMapData, show3dMap } from "@mappedin/mappedin-js";

// See Demo API key Terms and Conditions
// https://developer.mappedin.com/docs/demo-keys-and-maps
const options = {
  key: "mik_qXazKlvESgIYDnEjh592707dc",
  secret: "mis_3ruxN8tDicovvLgBALRNYPfRmK8N7DsW3vUVSM4IMIZ947a1007",
  mapId: "693075fb2556a2000badcf17",
};

const images: Record<string, string> = {
  maintenance:
    "https://images.ctfassets.net/wlcuh44rvj2s/5t9wJ6oRQTIIw09Yip8xiC/38b8754d619c0aab0c86e9ff31917888/maintenance.svg",
  custodial:
    "https://images.ctfassets.net/wlcuh44rvj2s/7CcNm9eBPVC5qXj3P6sbRg/d2f9fc34860d885f639860dfe05fd3d6/custodial.svg",
  technology:
    "https://images.ctfassets.net/wlcuh44rvj2s/NDXrVn4C68LlHM6jr6SZP/970c4ebfdfd06214184512c8d791844e/technology.svg",
  security:
    "https://images.ctfassets.net/wlcuh44rvj2s/byeBJ45iPPqIQbDun6Kwm/d5648d5b285767322b69c514e9d8bd04/security.svg",
};

// Get DOM Elements
const modal = document.querySelector("#my-modal")!;
const modalFooter = document.querySelector(".modal-footer")!;
const closeBtn = document.querySelector(".close")!;
const submitBtn = document.querySelector(".submitTicket")!;
const categorySelect = document.querySelector(".categorySelect")!;
const locationInput = document.querySelector(".location")!;

async function init() {
  const mapData = await getMapData(options);
  const mapView = await show3dMap(
    document.getElementById("app") as HTMLDivElement,
    mapData
  );

  // Set each space to be interactive and its hover color to orange.
  mapData.getByType("space").forEach((space) => {
    mapView.updateState(space, {
      interactive: true,
      hoverColor: "#f26336",
    });
  });

  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", outsideClick);
  submitBtn.addEventListener("click", submitClick);
  var coordinate: Coordinate;

  function openModal() {
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function outsideClick(e) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  }

  // Close on submit Click
  function submitClick(e) {
    modalFooter.style.display = "block";
    setTimeout(function () {
      modal.style.display = "none";
      modalFooter.style.display = "none";
      addWorkOrderMarker(categorySelect.value);
      categorySelect.value = "maintenance";
      document.querySelector("#requestDetails")!.value = "";
      locationInput.value = "";
    }, 1500);
  }

  // Act on the click event.
  mapView.on("click", async (event) => {
    coordinate = event.coordinate;

    locationInput.value = "";

    if (event.spaces) {
      locationInput.value = event.spaces[0]?.name;
    }

    openModal();
  });

  function addWorkOrderMarker(category: string) {
    const templateHtml = `<div class="alarm-marker"><img  src="${images[category]}" /></div>`;
    mapView.Markers.add(coordinate, templateHtml);
  }
}

init();
