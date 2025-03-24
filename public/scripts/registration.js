// Function to gather form data and submit the registration
async function submitRegistration() {
  try {
    // Show loading state
    startLoading();
    
    // Get form values
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const university = document.getElementById('university').value;
    const teamName = document.getElementById('teamName')?.value || '';
    
    // Get selected events
    const selectedEvents = Array.from(document.querySelectorAll('.event-checkbox-input:checked')).map(checkbox => {
      const card = checkbox.closest('.event-card');
      return {
        id: card.dataset.eventId,
        name: card.querySelector('h3').textContent,
        fee: parseInt(card.dataset.fee, 10),
        category: card.dataset.category
      };
    });
    
    // Calculate total fee
    const totalFee = selectedEvents.reduce((sum, event) => sum + event.fee, 0);
    
    // Get payment method and transaction ID
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const transactionId = paymentMethod === 'upi' 
      ? document.getElementById('transactionId').value 
      : document.getElementById('manualTransactionId').value;
    
    if (!transactionId || transactionId.trim().length < 4) {
      throw new Error('Please enter a valid transaction ID (at least 4 characters)');
    }
    
    // Create registration payload
    const registrationData = {
      name,
      email,
      phone,
      university,
      events: selectedEvents.map(event => event.id),
      eventNames: selectedEvents.map(event => event.name),
      fee: totalFee,
      payment_method: paymentMethod,
      transactionId: transactionId,
      team_name: teamName,
      team_members: getTeamMembers(),
      payment_status: 'pending',
      registration_id: generateRegistrationId(),
      created_at: new Date().toISOString(),
      category: selectedEvents[0]?.category || 'tech', // Use first event's category or default to tech
      totalFee: totalFee
    };
    
    // Save registration to database using the RegistrationService
    const result = await RegistrationService.submitRegistration(registrationData);
    
    if (!result.success) {
      throw new Error(result.error || 'Registration failed');
    }
    
    console.log('Registration successful:', result);
    
    // Show success message
    showSuccessMessage(name, result.registrationId);
  } catch (error) {
    console.error('Registration error:', error);
    showErrorMessage(error.message);
  } finally {
    stopLoading();
  }
}

// Helper function to get team members
function getTeamMembers() {
  const teamMembers = [];
  const inputs = document.querySelectorAll('input[name^="teamMember"]');
  
  inputs.forEach(input => {
    const value = input.value.trim();
    if (value) {
      teamMembers.push(value);
    }
  });
  
  return teamMembers;
}

// Generate a registration ID (for preview, will be replaced by server-generated ID)
function generateRegistrationId() {
  return `INF-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
}

// Show success message
function showSuccessMessage(name, registrationId) {
  const registrationForm = document.getElementById('registrationForm');
  const successMessage = document.getElementById('successMessage');
  
  if (registrationForm && successMessage) {
    registrationForm.classList.add('hidden');
    successMessage.classList.remove('hidden');
    
          const registrationIdElement = document.getElementById('registrationId');
        registrationIdElement.textContent = registrationId;
      }
    }