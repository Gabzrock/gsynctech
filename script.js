// Initialize Drag and Drop when the page loads
    window.onload = function() {
        document.getElementById('quoteDate').valueAsDate = new Date();
        
        // Make Hardware table draggable
        Sortable.create(document.getElementById('tableBody'), {
            handle: '.drag-handle',
            animation: 150
        });

        // Make Services table draggable
        Sortable.create(document.getElementById('serviceTableBody'), {
            handle: '.drag-handle',
            animation: 150
        });
    };

    function previewImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgBox = input.nextElementSibling;
                imgBox.src = e.target.result;
                imgBox.style.display = 'block';
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function removeRow(btn) {
        if(confirm("Are you sure you want to delete this item?")) {
            const row = btn.closest('tr');
            row.parentNode.removeChild(row);
            calculate(); // Recalculate totals immediately
        }
    }

    function addRow() {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="drag-handle" title="Drag to reorder">☰</td>
            <td><input type="text" class="item-code" placeholder="Model No."></td>
            <td><input type="text" class="item-desc" placeholder="Item description"></td>
            <td>
                <input type="file" accept="image/*" onchange="previewImage(this)">
                <img class="img-preview-box" src="">
            </td>
            <td><input type="number" class="item-qty" value="1" onchange="calculate()"></td>
            <td><input type="number" class="item-price" value="0" onchange="calculate()"></td>
            <td class="item-total" style="font-weight:bold;">₱ 0.00</td>
            <td style="text-align: center;"><button class="btn-delete" onclick="removeRow(this)" title="Delete Row">✖</button></td>
        `;
        document.getElementById('tableBody').appendChild(tr);
    }

    function addServiceRow() {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="drag-handle" title="Drag to reorder">☰</td>
            <td><input type="text" class="service-desc" placeholder="Service description"></td>
            <td><input type="number" class="service-qty" value="1" onchange="calculate()"></td>
            <td><input type="number" class="service-price" value="0" onchange="calculate()"></td>
            <td class="service-total" style="font-weight:bold;">₱ 0.00</td>
            <td style="text-align: center;"><button class="btn-delete" onclick="removeRow(this)" title="Delete Row">✖</button></td>
        `;
        document.getElementById('serviceTableBody').appendChild(tr);
    }

    function calculate() {
        let grand = 0;
        
        document.querySelectorAll('#tableBody tr').forEach(row => {
            const q = parseFloat(row.querySelector('.item-qty').value) || 0;
            const p = parseFloat(row.querySelector('.item-price').value) || 0;
            const total = q * p;
            row.querySelector('.item-total').innerText = '₱ ' + total.toLocaleString('en-PH', {minimumFractionDigits: 2});
            grand += total;
        });

        document.querySelectorAll('#serviceTableBody tr').forEach(row => {
            const q = parseFloat(row.querySelector('.service-qty').value) || 0;
            const p = parseFloat(row.querySelector('.service-price').value) || 0;
            const total = q * p;
            row.querySelector('.service-total').innerText = '₱ ' + total.toLocaleString('en-PH', {minimumFractionDigits: 2});
            grand += total;
        });

        document.getElementById('grandTotal').innerText = '₱ ' + grand.toLocaleString('en-PH', {minimumFractionDigits: 2});
    }

    function clearForm() {
        if (!confirm("Are you sure you want to clear the entire form? This cannot be undone.")) {
            return;
        }

        // Clear text inputs
        document.getElementById('clientName').value = '';
        document.getElementById('clientAddress').value = '';
        document.getElementById('clientContact').value = '';
        document.getElementById('clientNotes').value = '';
        
        // Reset Date
        document.getElementById('quoteDate').valueAsDate = new Date();

        // Reset Tables to single empty rows
        document.getElementById('tableBody').innerHTML = `
            <tr>
                <td class="drag-handle" title="Drag to reorder">☰</td>
                <td><input type="text" class="item-code" placeholder="DS-2CE16D0T"></td>
                <td><input type="text" class="item-desc" placeholder="Hikvision 2MP Outdoor Bullet Camera"></td>
                <td>
                    <input type="file" accept="image/*" onchange="previewImage(this)">
                    <img class="img-preview-box" src="">
                </td>
                <td><input type="number" class="item-qty" value="1" onchange="calculate()"></td>
                <td><input type="number" class="item-price" value="0" onchange="calculate()"></td>
                <td class="item-total" style="font-weight:bold;">₱ 0.00</td>
                <td style="text-align: center;"><button class="btn-delete" onclick="removeRow(this)" title="Delete Row">✖</button></td>
            </tr>
        `;

        document.getElementById('serviceTableBody').innerHTML = `
            <tr>
                <td class="drag-handle" title="Drag to reorder">☰</td>
                <td><input type="text" class="service-desc" placeholder="Standard Installation & Configuration"></td>
                <td><input type="number" class="service-qty" value="1" onchange="calculate()"></td>
                <td><input type="number" class="service-price" value="0" onchange="calculate()"></td>
                <td class="service-total" style="font-weight:bold;">₱ 0.00</td>
                <td style="text-align: center;"><button class="btn-delete" onclick="removeRow(this)" title="Delete Row">✖</button></td>
            </tr>
        `;

        // Recalculate to zero
        calculate();
    }

    function prepareDocumentData() {
        // Handle Date
        const dateInput = document.getElementById('quoteDate').value;
        document.getElementById('doc-date').innerText = dateInput ? new Date(dateInput).toLocaleDateString() : new Date().toLocaleDateString();

        // Handle Client Info
        document.getElementById('doc-client-name').innerText = document.getElementById('clientName').value || "Valued Client";
        document.getElementById('doc-client-address').innerText = document.getElementById('clientAddress').value || "N/A";
        
        // Handle Contact Info Visibility
        const contactVal = document.getElementById('clientContact').value;
        const contactSpan = document.getElementById('doc-client-contact');
        if (contactVal) {
            contactSpan.innerText = "Contact: " + contactVal;
            contactSpan.style.display = "block";
        } else {
            contactSpan.style.display = "none";
        }

        // Totals and Notes
        document.getElementById('doc-total-val').innerText = document.getElementById('grandTotal').innerText;

        const notesValue = document.getElementById('clientNotes').value.trim();
        const notesSection = document.getElementById('doc-notes-section');
        if (notesValue) {
            document.getElementById('doc-notes-content').innerText = notesValue;
            notesSection.style.display = 'block';
        } else {
            notesSection.style.display = 'none';
        }

        // Hardware List
        const itemList = document.getElementById('doc-items-list');
        itemList.innerHTML = '';
        document.querySelectorAll('#tableBody tr').forEach(row => {
            const code = row.querySelector('.item-code').value;
            const desc = row.querySelector('.item-desc').value;
            const imgSrc = row.querySelector('.img-preview-box').getAttribute('src');
            const qty = row.querySelector('.item-qty').value;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const total = row.querySelector('.item-total').innerText;

            if (desc || code) {
                const imgHtml = imgSrc ? `<img src="${imgSrc}" style="max-width: 35px; max-height: 35px; object-fit: contain;">` : `<span style="color:#ccc; font-size:9px;">N/A</span>`;
                const formattedPrice = '₱ ' + price.toLocaleString('en-PH', {minimumFractionDigits: 2});

                itemList.innerHTML += `
                    <tr>
                        <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: center; vertical-align: middle;">${imgHtml}</td>
                        <td style="padding: 6px; border-bottom: 1px solid #eee; font-weight: 600;">${code}</td>
                        <td style="padding: 6px; border-bottom: 1px solid #eee;">${desc}</td>
                        <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
                        <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right;">${formattedPrice}</td>
                        <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${total}</td>
                    </tr>
                `;
            }
        });

        // Services List
        const serviceList = document.getElementById('doc-services-list');
        serviceList.innerHTML = '';
        let hasServices = false;
        document.querySelectorAll('#serviceTableBody tr').forEach(row => {
            const desc = row.querySelector('.service-desc').value;
            const qty = row.querySelector('.service-qty').value;
            const price = parseFloat(row.querySelector('.service-price').value) || 0;
            const total = row.querySelector('.service-total').innerText;

            if (desc) {
                hasServices = true;
                const formattedPrice = '₱ ' + price.toLocaleString('en-PH', {minimumFractionDigits: 2});

                serviceList.innerHTML += `
                    <tr>
                        <td style="padding: 6px; border-bottom: 1px solid #eee;">${desc}</td>
                        <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
                        <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right;">${formattedPrice}</td>
                        <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${total}</td>
                    </tr>
                `;
            }
        });
        
        document.getElementById('doc-services-wrapper').style.display = hasServices ? 'block' : 'none';
    }

    function generateImage() {
        prepareDocumentData();
        const element = document.getElementById('doc-content');

        html2canvas(element, { scale: 2, useCORS: true, windowWidth: 794 }).then(canvas => {
            const link = document.createElement('a');
            const client = document.getElementById('clientName').value.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'new';
            link.download = `RC17_Quote_${client}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.98);
            link.click();
        });
    }