const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function submitForm(e) {
    function onReaderLoad(event){
        var obj = JSON.parse(event.target.result);

        obj.forEach(item => {
            var formData = new FormData();

            item.media.forEach(mediaItem => {
                formData.append("image", {
                    name: mediaItem.uri,
                    uri: images.files[Array.from(images.files).findIndex(file => file.webkitRelativePath === mediaItem.uri)],
                    type: 'image/jpeg'
                })
            })

            formData.append("title", item.title);
            formData.append("creatorId", _id)
            formData.append("sentAllowScreenshots", sentAllowScreenshots);

            fetch("https://it-solutions.homedns.org:9443/tempRoute/postImage", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Access-Control-Allow-Origin": "https://google.com"
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.error(err);
            })
        })
    }

    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const jsonFile = document.getElementById("jsonFile");
    const images = document.getElementById("images");
    const _id = 'coming soon'
    const sentAllowScreenshots = document.getElementById("allowScreenshots").checked;
    console.log(sentAllowScreenshots);
    console.log(images.files[100])
    console.log(Array.from(images.files).findIndex(file => file.webkitRelativePath === "posts/202203/275029266_377078910582285_531076097894983602_n_17905390460518753.jpg"));

    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(jsonFile.files[0]);

    
    /*
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    for(let i =0; i < images.files.length; i++) {
        formData.append("files", images.files[i]);
    }
    fetch("http://localhost:5000/upload_files", {
        method: 'POST',
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
    })
        .then((res) => console.log(res))
        .catch((err) => ("Error occured", err));
    */
}