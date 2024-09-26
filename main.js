var arr;
var w;
var h;

const main = () => {
    console.log("init");

    const imgFile = document.getElementById("imgfile");
    const image = new Image();

    const file = imgFile.files[0];
    console.log(file);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (e) => {
        console.log("loaded");
        console.log(e);
        image.src = e.target.result;

        image.onload = async (r) => {
            console.log("gggggg");
            console.log(r);

            const canvas = document.getElementById("canvas");

            const ctx = canvas.getContext("2d");

            canvas.width = image.width;
            canvas.height = image.height;
            w = image.width;
            h = image.height;

            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            console.log(imageData);
            console.log(imageData.colorSpace);
            console.log(imageData.data.length);

            arr = new Uint8ClampedArray(imageData.data.length);

            for (let i = 0; i < arr.length; i += 3) {
                arr[i] = imageData.data[i];
                arr[i + 1] = imageData.data[i + 1];
                arr[i + 2] = imageData.data[i + 2];
            }
        };
    };
};
function save() {}
async function encode() {
    document.getElementById("logs").innerHTML = ""
    const canvas_result = document.getElementById("canvas_result");
    const ctx_result = canvas_result.getContext("2d");
    canvas_result.width = w;
    canvas_result.height = h;
    const inputT = document.getElementById("text").value;
    const data = [];
    for (let c of inputT) {
        console.log(c, c.charCodeAt(0));
        data.push(c.charCodeAt(0));
    }

    if (data.length > arr.length) {
        throw Error("Msg to big");
    }

    log_array([], inputT, "Letters");
    log_array(arr, [], "Colors Before");
    for (let i = 0; i < data.length; i++) {
        arr[i] += data[i];
    }
    log_array(arr, [], "Colors After");

    const imageDataR = new ImageData(arr, w);
    const bmp = await createImageBitmap(imageDataR);
    ctx_result.drawImage(bmp, 0, 0);
}

function log_array(arr, data = [], title = "") {
    let count = 0;
    const l = document.getElementById("logs");
    l.innerText = l.innerText + title;
    l.innerHTML += "<br>";
    for (let a of arr) {
        if (count > 5) {
            return;
        }
        console.log(a);
        l.innerText = l.innerText + a;
        l.innerHTML += "<br>";
        count++;
    }

    if (data.length != 0) {
        const l = document.getElementById("logs");
        l.innerText = l.innerText + title;
        l.innerHTML += "<br>";
        for (let a of data) {
            if (count > 5) {
                return;
            }

            l.innerText = l.innerText + a + a.charCodeAt(0);
            l.innerHTML += "<br>";
            count++;
        }
    }
    l.innerHTML += "<br>";
}
