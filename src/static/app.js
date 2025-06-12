document.addEventListener('DOMContentLoaded', async () => {
    const activitiesList = document.getElementById('activities-list');
    const activitySelect = document.getElementById('activity');
    const signupForm = document.getElementById('signup-form');
    const messageDiv = document.getElementById('message');

    // Carregar atividades
    async function loadActivities() {
        try {
            const response = await fetch('/activities');
            const activities = await response.json();
            
            // Limpar a lista de atividades
            activitiesList.innerHTML = '';
            activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

            // Adicionar cada atividade
            for (const [name, details] of Object.entries(activities)) {
                // Criar card da atividade
                const card = document.createElement('div');
                card.className = 'activity-card';
                card.innerHTML = `
                    <h4>${name}</h4>
                    <p>${details.description}</p>
                    <p><strong>Schedule:</strong> ${details.schedule}</p>
                    <p><strong>Availability:</strong> ${details.participants.length}/${details.max_participants} participants</p>
                    <div class="participants-list">
                        <h5>Current Participants:</h5>
                        <ul>
                            ${details.participants.map(email => `<li>${email}</li>`).join('')}
                        </ul>
                    </div>
                `;
                activitiesList.appendChild(card);

                // Adicionar opção ao select
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                activitySelect.appendChild(option);
            }
        } catch (error) {
            console.error('Error loading activities:', error);
            activitiesList.innerHTML = '<p>Error loading activities. Please try again later.</p>';
        }
    }

    // Carregar atividades inicialmente
    await loadActivities();

    // Manipular envio do formulário
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const activity = activitySelect.value;

        try {
            const response = await fetch(`/activities/${encodeURIComponent(activity)}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });

            if (response.ok) {
                messageDiv.textContent = 'Successfully signed up for the activity!';
                messageDiv.className = 'message success';
                await loadActivities(); // Recarregar atividades para atualizar a lista
            } else {
                const error = await response.json();
                messageDiv.textContent = error.detail || 'Error signing up for activity';
                messageDiv.className = 'message error';
            }
        } catch (error) {
            messageDiv.textContent = 'Error connecting to server';
            messageDiv.className = 'message error';
        }

        messageDiv.classList.remove('hidden');
    });
});
  // Initialize app
  fetchActivities();

