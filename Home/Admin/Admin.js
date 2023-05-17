const createSlot = document.getElementsByClassName('createSlot')[0];
const form = document.querySelector('form');
let registeredParkingSlots = JSON.parse(localStorage.getItem('registeredParkingSlots'));

window.addEventListener('storage', (event) => {
    if (event.storageArea === localStorage) {
      // Local storage has been updated
      // Refresh the page
      location.reload();
    }
  });
createSlot.addEventListener('click', () => {
    const parkingName = document.querySelector('#parkingName').value;
    const parkingPlace = document.querySelector('#parkingPlace').value;
    const mobileNumber = document.querySelector('#mobileNumber').value;
    const noOfSlot = document.querySelector('#noOfSlot').value;
    const newParkingSlot = {
        parkingName,
        parkingPlace,
        mobileNumber,
        noOfSlot,
        isBooked: [],

    };
    switch (true) {
        case parkingName == '':
            const parkingNameReq = document.getElementById('parkingNameReq');
            parkingNameReq.innerHTML = "parking name is required";
            parkingNameReq.classList.add('red')
            break;
        case parkingPlace == '':
            const parkingPlaceReq = document.getElementById('parkingPlaceReq');
            parkingPlaceReq.innerHTML = "parking place is required";
            parkingPlaceReq.classList.add('red')
            break;
        case mobileNumber == '':
            const mobileNoReq = document.getElementById('mobileNoReq');
            mobileNoReq.innerHTML = " mobile number is required";
            mobileNoReq.classList.add('red')
            break;
        case mobileNumber < 0:
            const validMobile = document.getElementById('mobileNoReq');
            validMobile.innerHTML = "in valid mobile number";
            validMobile.classList.add('red')
            break;
        case noOfSlot == '':
            const noOfSlotReq = document.getElementById('noOfSlotReq');
            noOfSlotReq.innerHTML = "slots  required";
            noOfSlotReq.classList.add('red')
            break;
        case noOfSlot > 20:
            const validSlot = document.getElementById('noOfSlotReq');
            validSlot.innerHTML = "invalid";
            validSlot.classList.add('red')
            break;
        default:
            document.getElementById('parkingNameReq').innerHTML = '';
            document.getElementById('parkingPlaceReq').innerHTML = '';
            document.getElementById('mobileNoReq').innerHTML = '';
            document.getElementById('noOfSlotReq').innerHTML = '';
    }

    const isValidate = () => {
        if (parkingName !== '' && parkingPlace !== '' && mobileNumber !== '' && mobileNumber > 0 && noOfSlot !== '' && noOfSlot > 0 && noOfSlot < 20) {
            return true;
        }
        return false;
    }
    let isAlreadyRegistered = false;
    let registeredParkingSlots = JSON.parse(localStorage.getItem('registeredParkingSlots')) || [];

    registeredParkingSlots.find((obj) => {
        if (obj.parkingName == parkingName || obj.parkingPlace == parkingPlace || obj.mobileNumber == mobileNumber) {
            return isAlreadyRegistered = true
        }
    })

    if (isValidate()) {
        if (isAlreadyRegistered) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'already registered'
            })
        } else {
            console.log("registeredParkingSlots before", registeredParkingSlots)
            Swal.fire({
                title: 'Do you want create slot?',
                showCancelButton: true,
                confirmButtonText: 'yes',
                denyButtonText: `Don't save`,
            }).then((result) => {

                console.log("registeredParkingSlots after", registeredParkingSlots)
                if (result.isConfirmed) {
              
                    registeredParkingSlots.push(newParkingSlot);
                    localStorage.setItem('registeredParkingSlots', JSON.stringify(registeredParkingSlots));
                            closeBtn();
                            form.reset()
                }
            })
        }
    }
    function closeBtn() {
        const closBtn = document.getElementsByClassName('closeBtn')[0];
        
        closBtn.click();
        location.reload()
    }


})
registeredParkingSlots.forEach((item, idx) => {
    console.log(item)
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
          <button class="btn delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div> `;

    const parkingCards = document.getElementById('parkingCards');
    parkingCards.appendChild(card);
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
        modalTitle.textContent = 'View Slots';

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.classList.add('btn-close');
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'Close');

        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body', 'paraent-slots-div');

        // add small divs for each slot
        for (let i = 1; i <= item.noOfSlot; i++) {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('small-slot-divs')
            slotDiv.textContent = `${i}`;
            const isSlotBooked = registeredParkingSlots[idx].isBooked.some(obj => obj.slotNumber === `${i}`);
            if (isSlotBooked) {
                slotDiv.classList.add('isBookedGreen');
            }
            modalBody.appendChild(slotDiv);
        }


        

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
const deleteBtns = document.querySelectorAll('.delete-btn');
console.log(deleteBtns)
deleteBtns.forEach((deleteBtn, idx) => {
deleteBtn.addEventListener('click', () => {
// Remove the item from localStorage
registeredParkingSlots.splice(idx, 1);
localStorage.setItem('registeredParkingSlots', JSON.stringify(registeredParkingSlots));

// Remove the corresponding card from the DOM
deleteBtn.closest('.box-shadow').remove();
location.reload()

});
});





