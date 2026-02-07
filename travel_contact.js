const formName = document.getElementById("name")
const formEmail = document.getElementById("email");
const formMessage = document.getElementById("message");

document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault()
    
    console.log(`${formName.value} with email address ${formEmail.value} submitted the comment: ${formMessage.value}. Submission acknowledged";`)
    alert(`Thank you for your message, ${formName.value}!`);
    formName.value = "";
    formEmail.value = "";
    formMessage.value = "";
});