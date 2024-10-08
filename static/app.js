class Chatbox {
    constructor() {
        this.bodyDef()
        this.args = {
                openButton: document.querySelector('.chatbox__button'),
                chatBox: document.querySelector('.chatbox__support'),
                sendButton: document.querySelector('.send__button')
        }
        this.state = false;
        this.message = [];
    }

    bodyDef() {
        var HTML_TEXT = `<div class="container">
    <div class="chatbox">
        <div class="chatbox__support">
            <div class="chatbox__header">
                <div class="chatbox__image--header">
                    <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="image">
                </div>
                <div class="chatbox__content--header">
                    <h4 class="chatbox__heading--header">Chat support</h4>
                    <p class="chatbox__description--header">Hi. My name is Sam. How can I help you?</p>
                </div>
            </div>
            <div class="chatbox__messages">
                <div></div>
            </div>
            <div class="chatbox__footer">
                <input type="text" placeholder="Write a message...">
                <button class="chatbox__send--footer send__button">Send</button>
            </div>
        </div>
        <div class="chatbox__button">
            <button><img src="https://img.icons8.com/?size=100&id=16027&format=png&color=000000" /></button>
        </div>
    </div>
</div>`

        const body=document.querySelector("body")
        body.insertAdjacentHTML("afterbegin",HTML_TEXT)
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', ()=>this.toggleState(chatBox))
        sendButton.addEventListener('click', ()=>this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');

        node.addEventListener("keyup", ({key})=>{
            if (key ==="Enter") {
                this.onSendButton(chatBox)
            }
        })
    }   

    toggleState(chatbox) {
        this.state = !this.state;

        //show or hides the box
        if(this.state){
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox){
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1==="") {
            return;
        }
        let msg1 = {name: "User", message: text1}
        this.message.push(msg1)

        //http://127.0.0.1:5000/predict
        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({message: text1}),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }) //Promise<Response>
        .then(r => r.json()) //Promise<ay>
        .then(r => {
            let msg2 = {name: "Sam", message: r.answer };
            this.message.push(msg2);
            this.updateChattext(chatbox)
            textField.value = ''
        }).catch((error) => {
            console.error('Error:',error);
            this.updateChatText(chatbox)
            textField.value= ''
        });
    }

    updateChatText(chatbox) {
        var html = '';
        this.message.slice().reverse().forEach(function(item, number) {
            if (item.name === "Sam")
            {
                html+='<div class="messages__item messages__item--visitor">' +item.message +'</div>'
            }else {
                html+='<div class="messages__item messages__item--operator">' +item.message +'</div>'
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

}
const chatbox = new Chatbox();
chatbox.display();