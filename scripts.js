document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = "158204fdc053369feed4d4b6d6155595";
  const videoId = "824804225";
  const thumbnailUrl = await fetchThumbnail(videoId, accessToken);

  if (thumbnailUrl) {
    populateSwiperWithThumbnails(thumbnailUrl, videoId);
    initializeSwiper();
  }

  setupEventListeners();
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
    swiperWrapper.appendChild(createSwiperSlide(thumbnailUrl, videoId, i + 1));
  }
}

function createSwiperSlide(thumbnailUrl, videoId, index) {
  const swiperSlide = document.createElement("div");
  swiperSlide.classList.add("swiper-slide");
  swiperSlide.innerHTML = `
    <div class="video-thumbnail" data-vimeo-id="${videoId}" style="background-image:url('${thumbnailUrl}');">
      <div class="thumbnail-overlay">Video ${index}</div>
    </div>
  `;
  return swiperSlide;
}

function initializeSwiper() {
  new Swiper(".swiper-container", {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
  });
}

function setupEventListeners() {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const modal = document.getElementById("video-modal");
  const closeModalButton = document.getElementById("close-modal");

  swiperWrapper.addEventListener("click", (event) => {
    const videoThumbnail = event.target.closest(".video-thumbnail");
    if (videoThumbnail) {
      openModal(videoThumbnail.dataset.vimeoId);
    }
  });

  closeModalButton.addEventListener("click", () => closeModal());
}

function openModal(vimeoId) {
  const iframe = document.getElementById("video-iframe");
  const modal = document.getElementById("video-modal");
  iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  modal.style.display = "block";
}

function closeModal() {
  const iframe = document.getElementById("video-iframe");
  const modal = document.getElementById("video-modal");
  iframe.src = ""; // Stop the video when closing the modal
  modal.style.display = "none";
}
