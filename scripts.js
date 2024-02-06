document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = "158204fdc053369feed4d4b6d6155595";
  const videoId = "824804225";
  const thumbnailUrl = await fetchThumbnail(videoId, accessToken);

  if (thumbnailUrl) {
    populateSwiperWithThumbnails(thumbnailUrl, videoId);
    initializeSwiper();
  }

  setupEventListeners();
  setupModalPagination();
});

async function fetchThumbnail(videoId, accessToken) {
  try {
    const response = await fetch(
      `https://api.vimeo.com/videos/${videoId}/pictures`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const data = await response.json();
    return data.data[0].sizes.sort((a, b) => b.width - a.width)[0].link;
  } catch (error) {
    console.error("Error fetching thumbnails:", error);
    return null;
  }
}

function populateSwiperWithThumbnails(thumbnailUrl, videoId) {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  for (let i = 0; i < 8; i++) {
    swiperWrapper.appendChild(createSwiperSlide(thumbnailUrl, videoId, i));
  }
}

function createSwiperSlide(thumbnailUrl, videoId, index) {
  const swiperSlide = document.createElement("div");
  swiperSlide.classList.add("swiper-slide");
  swiperSlide.innerHTML = `
    <div class="video-thumbnail" data-vimeo-id="${videoId}" style="background-image:url('${thumbnailUrl}');" data-index="${index}">
      <div class="thumbnail-overlay">Video ${index + 1}</div>
    </div>
  `;
  return swiperSlide;
}

function initializeSwiper() {
  new Swiper(".swiper-container", {
    slidesPerView: 4,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

function setupEventListeners() {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const closeModalButton = document.getElementById("close-modal");

  swiperWrapper.addEventListener("click", (event) => {
    const videoThumbnail = event.target.closest(".video-thumbnail");
    if (videoThumbnail) {
      openModal(videoThumbnail.dataset.index);
    }
  });

  closeModalButton.addEventListener("click", () => closeModal());
}

function setupModalPagination() {
  const modalContent = document.querySelector(".modal-content");
  let modalPagination = modalContent.querySelector(".modal-pagination");

  if (!modalPagination) {
    modalPagination = document.createElement("div");
    modalPagination.classList.add("modal-pagination");
    modalContent.appendChild(modalPagination);
  } else {
    modalPagination.innerHTML = "";
  }

  for (let i = 0; i < 8; i++) {
    const dot = document.createElement("span");
    dot.classList.add("pagination-dot");
    dot.dataset.index = i;
    dot.addEventListener("click", () => {
      openModal(i);
    });
    modalPagination.appendChild(dot);
  }

  updateModalPaginationDots();
}

function openModal(index) {
  const iframe = document.getElementById("video-iframe");
  const modal = document.getElementById("video-modal");
  const videoId = "824804225";
  iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  modal.style.display = "flex";
  currentIndex = parseInt(index);

  updateModalPaginationDots();
}

function closeModal() {
  const iframe = document.getElementById("video-iframe");
  const modal = document.getElementById("video-modal");
  iframe.src = "";
  modal.style.display = "none";
}

let currentIndex = 0;

function updateModalPaginationDots() {
  const dots = document.querySelectorAll(".pagination-dot");
  dots.forEach((dot) => {
    dot.classList.toggle(
      "active",
      parseInt(dot.dataset.index) === currentIndex
    );
  });
}
