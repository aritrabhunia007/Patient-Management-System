// CareSync - Frontend Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // Set Current Date
    const dateDisplay = document.getElementById('currentDateDisplay');
    if (dateDisplay) {
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // --- Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked nav
            item.classList.add('active');

            // Hide all views
            views.forEach(view => view.classList.remove('active'));
            
            // Show target view
            const targetId = item.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });

    // --- Modal Logic ---
    const addPatientBtn = document.getElementById('addPatientBtn');
    const patientModal = document.getElementById('patientModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addPatientForm = document.getElementById('addPatientForm');

    let currentEditId = null;

    const openModal = () => {
        patientModal.classList.add('active');
        const title = document.getElementById('modalTitle');
        const statusGroup = document.getElementById('statusGroup');
        
        if (currentEditId) {
            if (title) title.textContent = 'Edit Patient';
            if (statusGroup) statusGroup.style.display = 'block';
        } else {
            if (title) title.textContent = 'Add New Patient';
            if (statusGroup) statusGroup.style.display = 'none';
        }
    };
    
    const closeModal = () => {
        patientModal.classList.remove('active');
        addPatientForm.reset();
        currentEditId = null;
    };

    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', () => {
            currentEditId = null;
            addPatientForm.reset();
            openModal();
        });
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    window.editPatient = function(id) {
        currentEditId = id;
        const patient = mockPatients.find(p => p.id === id);
        if (patient) {
            document.getElementById('p_name').value = patient.name;
            document.getElementById('p_age').value = patient.age;
            document.getElementById('p_gender').value = patient.gender;
            document.getElementById('p_contact').value = patient.contact;
            document.getElementById('p_history').value = patient.history || '';
            document.getElementById('p_status').value = patient.status;
            openModal();
        }
    };

    window.deletePatient = function(id) {
        if (confirm(`Are you sure you want to delete patient ${id}?`)) {
            const index = mockPatients.findIndex(p => p.id === id);
            if (index > -1) {
                mockPatients.splice(index, 1);
                
                // Re-render
                renderRecentPatients();
                const filterEl = document.getElementById('statusFilter');
                renderPatients(filterEl ? filterEl.value : 'all');
            }
        }
    };

    window.toggleStatus = function(id) {
        const patient = mockPatients.find(p => p.id === id);
        if (patient) {
            patient.status = (patient.status === 'active') ? 'discharged' : 'active';
            
            // Re-render
            renderRecentPatients();
            const filterEl = document.getElementById('statusFilter');
            renderPatients(filterEl ? filterEl.value : 'all');
        }
    };

    // Form Submit
    if (addPatientForm) {
        addPatientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('p_name').value;
            const age = document.getElementById('p_age').value;
            const gender = document.getElementById('p_gender').value;
            const contact = document.getElementById('p_contact').value;
            const history = document.getElementById('p_history').value;
            
            if (currentEditId) {
                // Update existing
                const patient = mockPatients.find(p => p.id === currentEditId);
                if (patient) {
                    patient.name = name;
                    patient.age = age;
                    patient.gender = gender;
                    patient.contact = contact;
                    patient.history = history;
                    patient.status = document.getElementById('p_status').value;
                }
                alert('Patient Updated Successfully!');
            } else {
                // Generate a random ID
                const newId = 'P-' + Math.floor(1000 + Math.random() * 9000);
                
                // Create new patient object
                const newPatient = {
                    id: newId,
                    name: name,
                    age: age,
                    gender: gender,
                    contact: contact,
                    disease: 'Pending Assessment',
                    status: 'active', // Default to active
                    history: history || 'No history provided'
                };
                
                // Add to mock array at the beginning
                mockPatients.unshift(newPatient);
                alert('Patient Added Successfully!');
            }
            
            closeModal();
            
            // Re-render views
            renderRecentPatients();
            
            // Keep current filter if applied
            const filterEl = document.getElementById('statusFilter');
            const currentFilter = filterEl ? filterEl.value : 'all';
            renderPatients(currentFilter);
        });
    }

    // --- Mock Data ---
    const mockPatients = [
        { id: 'P-1042', name: 'Eleanor Pena', age: 45, gender: 'Female', contact: '(555) 123-4567', disease: 'Hypertension', status: 'active', history: 'Diagnosed 2021' },
        { id: 'P-1043', name: 'Albert Flores', age: 32, gender: 'Male', contact: '(555) 987-6543', disease: 'Type 2 Diabetes', status: 'active', history: 'No prior history' },
        { id: 'P-1044', name: 'Floyd Miles', age: 58, gender: 'Male', contact: '(555) 456-7890', disease: 'Arthritis', status: 'discharged', history: 'Joint pain since 2018' },
        { id: 'P-1045', name: 'Bessie Cooper', age: 29, gender: 'Female', contact: '(555) 321-0987', disease: 'Asthma', status: 'active', history: 'Mild asthma' },
        { id: 'P-1046', name: 'Jerome Bell', age: 61, gender: 'Male', contact: '(555) 654-3210', disease: 'Coronary Artery Disease', status: 'pending', history: 'Stent placed 2019' },
    ];

    const mockSchedule = [
        { time: '09:00 AM', name: 'Eleanor Pena', type: 'Blood Pressure Check' },
        { time: '10:30 AM', name: 'Albert Flores', type: 'Glucose Monitoring' },
        { time: '01:00 PM', name: 'Bessie Cooper', type: 'Inhaler Prescription Update' },
        { time: '03:45 PM', name: 'Darrell Steward', type: 'General Checkup' }
    ];

    const mockTreatments = [
        { patientId: 'P-1042', disease: 'Hypertension', startDate: '2021-05-12', duration: 'Ongoing', followUp: '2026-10-15', status: 'Active' },
        { patientId: 'P-1043', disease: 'Type 2 Diabetes', startDate: '2023-01-20', duration: 'Ongoing', followUp: '2026-10-01', status: 'Active' },
        { patientId: 'P-1044', disease: 'Arthritis', startDate: '2018-11-05', duration: '6 Months', followUp: 'N/A', status: 'Completed' },
        { patientId: 'P-1045', disease: 'Asthma', startDate: '2022-08-30', duration: 'Ongoing', followUp: '2026-11-20', status: 'Active' },
        { patientId: 'P-1046', disease: 'Coronary Artery Disease', startDate: '2019-02-14', duration: '1 Year', followUp: '2026-09-25', status: 'Active' },
    ];

    const mockMedications = [
        { patientId: 'P-1042', medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribed: '2021-05-12' },
        { patientId: 'P-1043', medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribed: '2023-01-20' },
        { patientId: 'P-1044', medicine: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', prescribed: '2018-11-05' },
        { patientId: 'P-1045', medicine: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed', prescribed: '2022-08-30' },
        { patientId: 'P-1046', medicine: 'Aspirin', dosage: '81mg', frequency: 'Once daily', prescribed: '2019-02-14' },
    ];

    const mockNotifications = [
        { id: 1, title: 'New Lab Results', message: 'Blood work for Eleanor Pena is ready for review.', type: 'info', icon: 'ph-flask' },
        { id: 2, title: 'Appointment Rescheduled', message: 'Albert Flores moved his follow-up to tomorrow.', type: 'warning', icon: 'ph-calendar-blank' },
        { id: 3, title: 'Medication Refill Request', message: 'Bessie Cooper requested a refill for Albuterol.', type: 'action', icon: 'ph-pill' }
    ];

    // --- Render Functions ---
    
    // Render Recent Patients on Dashboard
    const renderRecentPatients = () => {
        const tbody = document.getElementById('recentPatientsList');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        // Take top 4 for dashboard
        mockPatients.slice(0, 4).forEach(patient => {
            const tr = document.createElement('tr');
            
            const initials = patient.name.split(' ').map(n => n[0]).join('');
            
            let statusClass = 'status-active';
            let statusText = 'Active';
            if (patient.status === 'discharged') { statusClass = 'status-discharged'; statusText = 'Discharged'; }
            if (patient.status === 'pending') { statusClass = 'status-pending'; statusText = 'Pending'; }

            tr.innerHTML = `
                <td>
                    <div class="patient-cell">
                        <div class="patient-avatar">${initials}</div>
                        <span class="patient-name">${patient.name}</span>
                    </div>
                </td>
                <td><span class="text-muted">${patient.id}</span></td>
                <td><span class="font-medium">${patient.contact}</span></td>
                <td>${patient.disease}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn" title="Toggle Status" onclick="toggleStatus('${patient.id}')"><i class="ph ph-arrows-left-right"></i></button>
                        <button class="action-btn" title="Edit" onclick="editPatient('${patient.id}')"><i class="ph ph-pencil-simple"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    // Render History (All Patients including past)
    const renderHistory = (filter = '') => {
        const tbody = document.getElementById('historyList');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        let filtered = mockPatients;
        if (filter) {
            const query = filter.toLowerCase();
            filtered = filtered.filter(p => 
                p.id.toLowerCase().includes(query) || 
                p.name.toLowerCase().includes(query) ||
                p.disease.toLowerCase().includes(query)
            );
        }
        
        filtered.forEach(patient => {
            const tr = document.createElement('tr');
            let statusClass = 'status-active';
            let statusText = 'Active';
            if (patient.status === 'discharged') { statusClass = 'status-discharged'; statusText = 'Discharged'; }
            if (patient.status === 'pending') { statusClass = 'status-pending'; statusText = 'Pending'; }
            
            tr.innerHTML = `
                <td><span class="text-muted font-medium">${patient.id}</span></td>
                <td><span class="font-medium">${patient.name}</span></td>
                <td>${patient.disease}</td>
                <td><span class="text-secondary">${patient.history}</span></td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            `;
            tbody.appendChild(tr);
        });
    };
    
    // Render Notifications
    const renderNotifications = () => {
        const list = document.getElementById('notificationList');
        if (!list) return;
        list.innerHTML = '';
        
        mockNotifications.forEach(notif => {
            const li = document.createElement('li');
            li.className = 'notification-item';
            li.innerHTML = `
                <div class="notification-icon"><i class="ph ${notif.icon}"></i></div>
                <div class="notification-content">
                    <h4>${notif.title}</h4>
                    <p>${notif.message}</p>
                </div>
            `;
            list.appendChild(li);
        });
    };

    // Render Follow-ups Details (using mockSchedule for simplicity)
    const renderFollowUpsDetails = () => {
        const list = document.getElementById('followUpsDetailsList');
        if (!list) return;
        list.innerHTML = '';
        
        mockSchedule.forEach(item => {
            const li = document.createElement('li');
            li.className = 'schedule-item';
            li.innerHTML = `
                <div class="time">${item.time}</div>
                <div class="event-details">
                    <h4>${item.name}</h4>
                    <p>${item.type}</p>
                </div>
            `;
            list.appendChild(li);
        });
    };

    // Render All Patients in Directory
    const renderPatients = (statusFilter = 'all') => {
        const tbody = document.getElementById('allPatientsList');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        let filteredPatients = mockPatients;
        if (statusFilter !== 'all') {
            filteredPatients = mockPatients.filter(p => p.status === statusFilter);
        }
        
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch && globalSearch.value) {
            const query = globalSearch.value.toLowerCase();
            filteredPatients = filteredPatients.filter(p => 
                p.id.toLowerCase().includes(query) || 
                p.name.toLowerCase().includes(query)
            );
        }
        
        filteredPatients.forEach(patient => {
            const tr = document.createElement('tr');
            
            const initials = patient.name.split(' ').map(n => n[0]).join('');

            tr.innerHTML = `
                <td><span class="text-muted font-medium">${patient.id}</span></td>
                <td>
                    <div class="patient-cell">
                        <div class="patient-avatar">${initials}</div>
                        <span class="patient-name">${patient.name}</span>
                    </div>
                </td>
                <td>${patient.age} / ${patient.gender.charAt(0)}</td>
                <td>${patient.contact}</td>
                <td>${patient.history}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn" title="Toggle Status" onclick="toggleStatus('${patient.id}')"><i class="ph ph-arrows-left-right"></i></button>
                        <button class="action-btn" title="Edit" onclick="editPatient('${patient.id}')"><i class="ph ph-pencil-simple"></i></button>
                        <button class="action-btn" title="Delete" onclick="deletePatient('${patient.id}')"><i class="ph ph-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    // Render Today's Schedule
    const renderSchedule = () => {
        const list = document.getElementById('todayScheduleList');
        if (!list) return;

        list.innerHTML = '';
        
        mockSchedule.forEach(item => {
            const li = document.createElement('li');
            li.className = 'schedule-item';
            
            li.innerHTML = `
                <div class="time">${item.time}</div>
                <div class="event-details">
                    <h4>${item.name}</h4>
                    <p>${item.type}</p>
                </div>
            `;
            list.appendChild(li);
        });
    };

    // Render Treatments
    const renderTreatments = (filterId = '') => {
        const tbody = document.getElementById('treatmentsList');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const globalSearch = document.getElementById('globalSearch');
        const query = (filterId || globalSearch?.value || '').trim().toLowerCase();
        const filtered = mockTreatments.filter(t => t.patientId.toLowerCase().includes(query));

        filtered.forEach(treatment => {
            const tr = document.createElement('tr');
            let statusClass = treatment.status === 'Active' ? 'status-active' : 'status-discharged';
            tr.innerHTML = `
                <td><span class="text-muted font-medium">${treatment.patientId}</span></td>
                <td><span class="font-medium">${treatment.disease}</span></td>
                <td>${treatment.startDate}</td>
                <td>${treatment.duration}</td>
                <td>${treatment.followUp}</td>
                <td><span class="status-badge ${statusClass}">${treatment.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    };

    // Render Medications
    const renderMedications = (filterId = '') => {
        const tbody = document.getElementById('medicationsList');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const globalSearch = document.getElementById('globalSearch');
        const query = (filterId || globalSearch?.value || '').trim().toLowerCase();
        const filtered = mockMedications.filter(m => m.patientId.toLowerCase().includes(query));

        filtered.forEach(med => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="text-muted font-medium">${med.patientId}</span></td>
                <td><span class="font-medium text-primary">${med.medicine}</span></td>
                <td>${med.dosage}</td>
                <td>${med.frequency}</td>
                <td>${med.prescribed}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    // Search Listeners
    const searchTreatments = document.getElementById('searchTreatments');
    if (searchTreatments) {
        searchTreatments.addEventListener('input', (e) => {
            renderTreatments(e.target.value);
        });
    }

    const searchMedications = document.getElementById('searchMedications');
    if (searchMedications) {
        searchMedications.addEventListener('input', (e) => {
            renderMedications(e.target.value);
        });
    }

    // Status Filter Listener
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            renderPatients(e.target.value);
        });
    }

    // Global Search Listener
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            const filterEl = document.getElementById('statusFilter');
            renderPatients(filterEl ? filterEl.value : 'all');
            
            const trSearch = document.getElementById('searchTreatments');
            renderTreatments(trSearch ? trSearch.value : '');
            
            const medSearch = document.getElementById('searchMedications');
            renderMedications(medSearch ? medSearch.value : '');
            
            // Re-render recent patients with search (simple display hide/show for dashboard)
            const query = e.target.value.toLowerCase();
            const tbodyRecent = document.getElementById('recentPatientsList');
            if (tbodyRecent) {
                Array.from(tbodyRecent.children).forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            }
        });
    }

    // History Search Listener
    const searchHistory = document.getElementById('searchHistory');
    if (searchHistory) {
        searchHistory.addEventListener('input', (e) => {
            renderHistory(e.target.value);
        });
    }

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        // Check local storage for theme
        if (localStorage.getItem('theme-3d') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.innerHTML = '<i class="ph ph-sun"></i> Theme';
        }
        
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme-3d', 'dark');
                themeToggleBtn.innerHTML = '<i class="ph ph-sun"></i> Theme';
            } else {
                localStorage.setItem('theme-3d', 'light');
                themeToggleBtn.innerHTML = '<i class="ph ph-moon"></i> Theme';
            }
        });
    }

    // --- Graph Modal Logic ---
    const graphModal = document.getElementById('graphModal');
    const closeGraphModalBtn = document.getElementById('closeGraphModalBtn');
    let currentChart = null;

    const openGraphModal = (title, chartConfig) => {
        if (!graphModal) return;
        document.getElementById('graphModalTitle').textContent = title;
        graphModal.classList.add('active');
        
        const ctx = document.getElementById('statChart').getContext('2d');
        if (currentChart) {
            currentChart.destroy();
        }
        
        currentChart = new Chart(ctx, chartConfig);
    };

    if (closeGraphModalBtn) {
        closeGraphModalBtn.addEventListener('click', () => {
            graphModal.classList.remove('active');
        });
    }

    const totalPatientsCard = document.getElementById('totalPatientsCard');
    if (totalPatientsCard) {
        totalPatientsCard.addEventListener('click', () => {
            const config = {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Total Patients',
                        data: [1020, 1050, 1100, 1150, 1210, 1248],
                        borderColor: '#3b82f6',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            };
            openGraphModal('Patient Growth Trend (6 Months)', config);
        });
    }

    const activeTreatmentsCard = document.getElementById('activeTreatmentsCard');
    if (activeTreatmentsCard) {
        activeTreatmentsCard.addEventListener('click', () => {
            const config = {
                type: 'bar',
                data: {
                    labels: ['Cardiology', 'Endocrinology', 'Pulmonology', 'Orthopedics', 'General'],
                    datasets: [{
                        label: 'Active Treatments',
                        data: [120, 85, 60, 45, 32],
                        backgroundColor: [
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(100, 116, 139, 0.8)'
                        ],
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            };
            openGraphModal('Active Treatments by Department', config);
        });
    }

    // --- New Features Logic ---
    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationsModal = document.getElementById('notificationsModal');
    const closeNotificationsBtn = document.getElementById('closeNotificationsBtn');
    if (notificationsBtn) notificationsBtn.addEventListener('click', () => notificationsModal.classList.add('active'));
    if (closeNotificationsBtn) closeNotificationsBtn.addEventListener('click', () => notificationsModal.classList.remove('active'));

    const upcomingFollowUpsCard = document.getElementById('upcomingFollowUpsCard');
    const followUpsModal = document.getElementById('followUpsModal');
    const closeFollowUpsBtn = document.getElementById('closeFollowUpsBtn');
    if (upcomingFollowUpsCard) upcomingFollowUpsCard.addEventListener('click', () => followUpsModal.classList.add('active'));
    if (closeFollowUpsBtn) closeFollowUpsBtn.addEventListener('click', () => followUpsModal.classList.remove('active'));

    const userProfileBtn = document.getElementById('userProfileBtn');
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    if (userProfileBtn) userProfileBtn.addEventListener('click', () => profileModal.classList.add('active'));
    if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => profileModal.classList.remove('active'));

    const viewAllPatientsBtn = document.getElementById('viewAllPatientsBtn');
    if (viewAllPatientsBtn) {
        viewAllPatientsBtn.addEventListener('click', () => {
            // Trigger click on Patients nav item
            const patientsNav = document.querySelector('.nav-item[data-target="patients"]');
            if (patientsNav) patientsNav.click();
        });
    }

    // Initial Renders
    renderRecentPatients();
    renderPatients();
    renderSchedule();
    renderTreatments();
    renderMedications();
    renderHistory();
    renderNotifications();
    renderFollowUpsDetails();

});
