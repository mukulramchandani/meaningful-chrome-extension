

const __debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

class Meaningful extends HTMLElement {
    constructor() {
      super();

    const shadowRoot = this.attachShadow({ mode: "open" });

      shadowRoot.innerHTML = `
      <style>
          .super{
              display:flex;
              justify-content:center;
          }

          .main{
              width:210px;
              background:rgb(217 197 137 / 96%);
              border-radius:30px;
              display:flex;
              flex-direction:column;
              position:absolute;
              z-index:999999;
              opacity:0;
              padding:15px;
              color:black;
              font-family:sans-serif;
              font-size:16px;
              box-shadow:rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
          }

          </style>

          <div class="super">
              <div class="main" id="meaningful">
              </div>
          </div>
      `;
  }
  
    isLoading = false;

  getWordMeaning = async (word) => {
      
      this.shadowRoot.getElementById("meaningful").innerHTML =
        `<h6 style="color:grey;font-size:14px;font-weight:bold">looking for ${word} ...</h6>`;
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.shadowRoot.getElementById("meaningful").innerHTML = `
            <div id="word"><b>${data[0]?.word || ""}</b>&nbsp; <span>            <i id="pronounce" style="color:lightslategray;font-size:14px">${data[0]?.phonetic || ""}</i>
            </span></div>
            <i id="pronounce" style="color:lightslategray;font-size:14px;font-weight:bold">${data[0]?.meanings[0]?.partOfSpeech || ""}</i>
            <p id="meaning">${
              data[0]?.meanings[0]?.definitions[0]?.definition ||
              "No Definition Available"
            }</p>
              `;
        })
        .catch(() => {
          // handle error
        });
    };

    handleSlectionChange = (event) => {
      const selection = window.getSelection();
      console.log(selection);

      // get the selected word
      const selectedWord = selection?.focusNode?.textContent?.slice(
        selection.anchorOffset,
        selection.focusOffset
      );

      const shadowElement = this.shadowRoot.getElementById("meaningful");
      // show the banner if word is selected and handle visibility

      if (selectedWord?.length) {
        this.isLoading = true;
        // get the rects of the selected word
        this.getWordMeaning(selectedWord);
        const selectionRect = selection.getRangeAt(0).getBoundingClientRect();
      
        shadowElement.style.visibility = "visible";
        shadowElement.style.opacity = "1";
          shadowElement.style.top = `${selectionRect.top + window.scrollY + 35
              }px`;

        if (selectionRect.right < window.outerWidth - 300)
        shadowElement.style.left = `${selectionRect.left}px`;
      } else {
        shadowElement.style.visibility = "hidden";
        shadowElement.style.opacity = "0";
      }
          
     
    };

    connectedCallback() {
      // add listener
      document.addEventListener("selectionchange", __debounce(this.handleSlectionChange));
    }

    disconnectedCallback() {}
}

window.customElements.define("meaning-ful", Meaningful);
document.body.appendChild(new Meaningful());



