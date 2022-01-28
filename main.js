Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(uploadImage);

// funcion de deteccion de rostro y carga de imagen
function uploadImage(){
    const con=document.querySelector('.container');
    const input=document.querySelector('#myImg');
    const imgFile=document.querySelector('#myFile');

    var can;
    var img;
    
    imgFile.addEventListener('change', async()=>{
        if (can){can.remove();}
        if (img){img.remove();}
        //html a partir de blob
        img = await faceapi.bufferToImage(myFile.files[0]);
        input.src=img.src;
        const results= await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors().withFaceExpressions().withAgeAndGender();
        console.log(results);
        const faceMatcher=new faceapi.FaceMatcher(results);
        results.forEach(fd=>{
            const bestMatch=faceMatcher.findBestMatch(fd.descriptor);
            console.log(bestMatch);
           
        })
        

        //creacion del canvas
        can=faceapi.createCanvasFromMedia(input);
        con.append(can);
        faceapi.matchDimensions(can,{width:input.width,height:input.height})
        //redimencion de la caja
        const detectionsForSize=faceapi.resizeResults(results,{width:input.width,height:input.height})
        const box=results[0].detection.box;
        const facebox=new faceapi.draw.DrawBox(box);
        faceapi.draw.drawDetections(can,detectionsForSize);
        faceapi.draw.drawFaceLandmarks(can, detectionsForSize)
        faceapi.draw.drawFaceExpressions(can, detectionsForSize);

        
        detectionsForSize.forEach( detection => {
            const box = detection.detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
            drawBox.draw(can)
          })

    })
}