const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");
const chatbotToggler=document.querySelector(".chatbot-toggler");
const chatbotCloseBtn=document.querySelector(".close-btn");


let userMessage;
const inputInitHeight=chatInput.scrollHeight;
const API_KEY="AIzaSyAWoVh4j1nt7H7_bwRSPvPb_NQXVxny9KI";

const createChatLi =(message,className)=>{
    const chatLi =document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent =className === "outgoing"? `<p>${message}</p>`:`<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML=chatContent;
    return chatLi;
};
     const generateResponse=(incomingChatLi) => {
    const API_URL= `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const messageElement=incomingChatLi.querySelector("p");
    const requestOptions={
        method:"POST",
        headers:{
            "content-Type":"application/json"
            
        },
        body:JSON.stringify({
            contents:[{
                role:"user",
                parts:[{text:userMessage}]
            }]
            
        }),  
    };

    fetch(API_URL,requestOptions).then(res=>res.json()).then(data=>{
        messageElement.textContent=data.candidates[0].content.parts[0].text;
    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent="oops!something went wrong.once check your internet connection, pls try again later.";
    }).finally(()=>chatbox.scrollTo(0,chatbox.scrollHeight));
};

const handleChat =() => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value="";
    chatInput.style.height=`${inputInitHeight}px`

   chatbox.appendChild(createChatLi(userMessage,"outgoing"));
   chatbox.scrollTo(0,chatbox.scrollHeight);

   setTimeout(()=> {
    const incomingChatLi=createChatLi("ThinkingMan....","incoming");
    chatbox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);

   },600);

}
chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${inputInitHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;
    
});
    chatInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        handleChat();
    }
    
});
chatbotToggler.addEventListener("click",()=> document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);