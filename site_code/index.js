export const importFuncToDom= (action, func, elemntId) => {
    const checkElementLoaded = setInterval(() => {
        const element = document.getElementById(elemntId);
        if (element) {
          console.log(element + " button available.");
          element.addEventListener(action, func);
          clearInterval(checkElementLoaded); // Stop checking once it's found
        }
      }, 100); // Check every 100ms
}