;(async () => {

    function post(endpoint, data) {
        return new Promise((resolve) => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", endpoint, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
            xhr.onload = function() {
              resolve(JSON.parse(this.responseText))
            }
        })
    }

    if (window.nano === undefined) {
        window.nano = {}
    }

    window.nano.cancel = (element) => {
        document.getElementById('nano-pay').remove()
    }
    
    window.nano.unlock = (element, amount, address) => {
        post('https://api.nano.to', { address, amount }).then((data) => {
            var template = `<div id="nano-pay" style="position: fixed;width: 100%;height: 100%;background: #000;z-index: 9999;left: 0;top: 0;right: 0;bottom: 0;display: flex;align-items: center;justify-content: center;flex-direction: column;color: #FFF;font-size: 30px;"> <img src="${data.qrcode}" style=" max-width: 200px; "> <div style=" margin: 40px; opacity: 1; ">${data.amount} NANO</div> <div style=" background: white; font-size: 21px; border-radius: 10px; padding: 10px 25px; color: #000; ">Open Wallet</div> <div onclick="window.nano.cancel(); return" style=" border-radius: 10px; padding: 10px 25px; color: #fff; margin-top: 24px; opacity: 0.4; font-size: 17px; ">Cancel</div></div>`;
            document.body.innerHTML += template;
        })
    }

    window.nano.ppv = (config) => {

        if (typeof config === 'string' && config.includes('nano_')) {
            config = { address: config }
        } else {
            config = config || {}
        }

        // if (!window.nano.address && !config.address) return console.error('Nano: NANO payment address missing:', config.element)

        if (!config.address || !config.address.includes('nano_')) return console.error('Nano: NANO payment address invalid:', config.element)

        if (!config.element) return console.error('Nano: No premium element provided:', config.element)
        if (!config.amount) return console.error('Nano: No price provided:', config.element)
        
        var all = document.querySelectorAll(config.element);

        for (var i=0, max=all.length; i < max; i++) {
            
            var item = all[i]
            
            item.style['min-height'] = "150px"; 
            item.style.position = "relative"; 
            
            let code = `<div id="nano-locked" style="position: absolute;background:${config.background || '#000'};width: 100%;height: 100%;top: 0;left: 0;bottom: 0;right: 0;font-size: 20px;min-height: 110px;display: flex;align-items: center;flex-direction: column;justify-content: center; color: ${config.color || '#FFF'}">
    <div>
        Unlock for ${config.amount} NANO.
    </div>
    <div onclick="window.nano.unlock('${config.element}', '${config.amount}', '${config.address}')" style=" cursor: pointer; padding: 5px 20px; border-radius: 15px; background: #FFF; margin: 10px 0; color: ${config.color || '#000'}">
        Unlock
    </div>
</div>`

            item.innerHTML += code

            window.nano.config = config

        }

    }

})();