let registeredParkingSlots = JSON.parse(localStorage.getItem('registeredParkingSlots')) || [];
window.addEventListener('storage', (event) => {
  if (event.storageArea === localStorage) {
    // Local storage has been updated
    // Refresh the page
    location.reload();
  }
});
let isBookedArray = [];
let url = window.location.href;
const queryString = url.split("?")[1];
const searchParams = new URLSearchParams(queryString);
const currentUser = searchParams.get('username');
console.log("currentUser",currentUser)
registeredParkingSlots.forEach((item, idx) => {
  const parKingcard = document.getElementById('parkingCards');
  const card = document.createElement('div');
  card.classList.add('col-md-4');
  card.innerHTML = `
    <div class="card mb-4 box-shadow">
    <div class="card-body">
      <div class="address-container">
        <h5 class="card-title">Address:</h5>
        <p class="card-text">Parking Name: ${item.parkingName}</p>
        <p class="card-text">Parking Place: ${item.parkingPlace}</p>
        <p class="card-text">Mobile: ${item.mobileNumber}</p>
        <hr class="hr-line">
      </div>
      <div class="slots-container">
        <h5 class="card-title">Slots:</h5>
        <p class="card-text">Total Number: ${item.noOfSlot}</p>
        <div class="button-container">
          <button class="btn view-slot-btn" id="viewSlot">View Slot</button>
          
        </div>
      </div>
    </div>
  </div> `;
  parKingcard.appendChild(card);
  const viewSlotBtn = document.getElementsByClassName('view-slot-btn')[idx];
  viewSlotBtn.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = `viewSlotModal-${idx}`;
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', `viewSlotModalLabel-${idx}`);
    modal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const modalTitle = document.createElement('h1');
    modalTitle.classList.add('modal-title', 'fs-5');
    modalTitle.id = `viewSlotModalLabel-${idx}`;
    modalTitle.textContent = 'Book Your Slots';

    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');
    // closeButton.textContent=<i class="fa-solid fa-xmark"></i>

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body', 'paraent-slots-div');
    const bookBtn = document.createElement('button');
    bookBtn.type = 'button';
    bookBtn.classList.add('btn', 'btn-success', 'bookBtn');
    bookBtn.textContent = 'Book';
    for (let i = 1; i <= item.noOfSlot; i++) {
      const slotDiv = document.createElement('div');
      slotDiv.classList.add('small-slot-divs');
      const slotNumber = `${i}`;
      slotDiv.textContent = slotNumber;
    
      const parkingSlot = registeredParkingSlots[idx];
      const bookedByCurrentUser = parkingSlot.isBooked.some(obj => obj.slotNumber === slotNumber && obj.username === currentUser);
    
      if (bookedByCurrentUser) {
        slotDiv.classList.add('isBookGreen');
      } else if (parkingSlot.isBooked.some(obj => obj.slotNumber === slotNumber)) {
        slotDiv.classList.add('isBookedRed');
      }
    
      slotDiv.addEventListener('click', () => {
        slotDiv.classList.toggle('isBookedGreen')
      });
    
      modalBody.appendChild(slotDiv);
    }
    
    bookBtn.addEventListener('click', () => {
      const greenSlots = modalBody.querySelectorAll('.isBookedGreen');
      for (const greenSlot of greenSlots) {
        const slotNumber = greenSlot.textContent;
        const parkingSlot = registeredParkingSlots[idx];
        if (parkingSlot.isBooked.some(obj => obj.slotNumber === slotNumber )) {
          alert(`Slot ${slotNumber} is already booked by the current user.`);
        } else {
          let url = window.location.href;
          const queryString = url.split("?")[1];
          const searchParams = new URLSearchParams(queryString);
          const username = searchParams.get('username');
          parkingSlot.userName = username;
    
          parkingSlot.isBooked.push({
            slotNumber,
            username
          });
        }
      }
    
      localStorage.setItem('registeredParkingSlots', JSON.stringify(registeredParkingSlots));
      viewSlotModal.hide();
    });
    


    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.classList.add('btn', 'btn-secondary');
    closeBtn.setAttribute('data-bs-dismiss', 'modal');
    closeBtn.textContent = 'Close';
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    modalFooter.appendChild(closeBtn);
    modalFooter.appendChild(bookBtn);


    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalDialog.appendChild(modalContent);

    modal.appendChild(modalDialog);

    document.body.appendChild(modal);

    // show the modal
    const viewSlotModal = new bootstrap.Modal(modal);
    viewSlotModal.show();
  })

});





