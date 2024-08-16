let images = document.querySelectorAll('.puzzle-img')
let puzzleSection = document.querySelector('.puzzle')
let puzzleContainer = document.querySelector('.solve-puzzle')
console.log(puzzleSection)
for(let img of images){
    img.addEventListener('click', function(){
        const photoName = img.getAttribute('src').split('.')[0]
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                puzzleSection.innerHTML += `<img draggable="false" src="assets/${photoName}/puzzle_piece_${i}_${j}.png"></img>`
            }
        }
        puzzleContainer.classList.add('active')
    })
}
let puzzleButton = document.querySelector('.solve-puzzle button')
let circleDiv = document.createElement('div')
const puzzleButtonWidth = puzzleButton.offsetWidth
puzzleButton.addEventListener('click', function(e){
    document.querySelector('html').classList.add('no-scroll')
    puzzleButton.appendChild(circleDiv)
    circleDiv.style.width = puzzleButtonWidth + 'px'
    circleDiv.style.height= puzzleButtonWidth + 'px'
    circleDiv.style.top = (e.pageY - puzzleButton.offsetTop - puzzleButtonWidth/2) + 'px'
    circleDiv.style.left = (e.pageX  - puzzleButton.offsetLeft - puzzleButtonWidth/2) + 'px'
    setTimeout(()=>{puzzleButton.removeChild(circleDiv)}, 600)
    puzzleSection.classList.add('active')
    setTimeout(() =>{
        let x = 0
        let inter = setInterval(function(){
            if(++x == 4){
                clearInterval(inter)
            }
            puzzleSection.querySelectorAll('img').forEach(el => {
                el.classList.add('abs')
                el.style.left = Math.floor(Math.random() * (puzzleSection.offsetWidth - el.offsetWidth)) + 'px'
                el.style.top = Math.floor(Math.random() * (puzzleSection.offsetHeight - el.offsetHeight)) + 'px'
            })
        }, 500)
        puzzleSection.addEventListener('mousedown', moveStart)
        puzzleSection.addEventListener('touchstart', moveStart)
    }, 1000)

})

let curImg;
let ShiftX = 0
let ShiftY = 0
let num = 0
let puzzleImages;
function moveStart(e){
    curImg = e.target

    if(curImg.tagName == 'SECTION'){
        return
    }
    puzzleImages = puzzleSection.querySelectorAll('img')
    for(let i = 0; i < 17; i++){
        if(puzzleImages[i] == curImg){
            num = i
            console.log('da')
        }
    }
    ShiftX = (e.clientX || e.touches[0].clientX) - curImg.offsetLeft
    ShiftY = (e.clientY || e.touches[0].clientY)- curImg.offsetTop
    curImg.classList.add('no-select')
    document.addEventListener('mouseup', MoveStop)
    puzzleContainer.addEventListener('mousemove', Moving)

    document.addEventListener('touchend', MoveStop)
    puzzleContainer.addEventListener('touchmove', Moving)
}

function Moving(e){
    curImg.style.left = (e.clientX || e.touches[0].pageX) - ShiftX + 'px'
    curImg.style.top = (e.clientY || e.touches[0].pageY) - ShiftY + 'px'
}
let pieces = [num]
let k = 1
function MoveStop(){
    curImg.classList.remove('no-select')

    let neigbourImg = []

    if([0,4,8,12].indexOf(num) != -1){
        neigbourImg = [num + 1, num - 4, num + 4]
    }else if([3,7,21,15].indexOf(num) != -1){
        neigbourImg = [num - 1, num - 4, num + 4]
    }
    else{
        neigbourImg = [num - 1, num + 1, num - 4, num + 4]
    }
    console.log(num, neigbourImg)
    for(let i of neigbourImg){
        if(i < 1 || i > 15){
            continue
        }
        const curImgLeft = curImg.offsetLeft
        const curImgWidth = curImg.offsetWidth
        const curImgTop = curImg.offsetTop
        const curImgHeight = curImg.offsetHeight
        const secondImgLeft = puzzleImages[i].offsetLeft
        const secondImgWidth = puzzleImages[i].offsetWidth
        const secondImgHeight = puzzleImages[i].offsetHeight
        const secondImgTop = puzzleImages[i].offsetTop
        if(i === num - 1){
            if(curImgLeft - (secondImgLeft + secondImgWidth) < 21 && secondImgLeft < curImgLeft){
                if(curImgTop + curImgHeight < (secondImgTop + secondImgHeight * 1.5) && curImgTop + curImgHeight > secondImgTop - secondImgHeight/2 ){
                    curImg.style.left = (secondImgLeft + secondImgWidth) + 'px'
                    curImg.style.top = secondImgTop + 'px'
                    pieces.push(i)
                    break
                }
            }
            
        }else if(i === num + 1){
            if(secondImgLeft - (curImgWidth+ curImgLeft) < 21 && secondImgLeft > (curImgWidth+ curImgLeft)){
                if(curImgTop + curImgHeight < (secondImgTop + secondImgHeight * 1.5) && curImgTop + curImgHeight > secondImgTop - secondImgHeight/2 ){
                    curImg.style.left = (secondImgLeft - curImgWidth) + 'px'
                    curImg.style.top = secondImgTop + 'px'
                    pieces.push(i)
                    break
                }
            }
        }else if(i === num + 4){
            if(secondImgTop - (curImgTop + curImgHeight < 21 && 
            curImgTop + curImgHeight < secondImgTop)){
                if(curImgLeft + curImgWidth > secondImgLeft - secondImgWidth/2 && curImgLeft + curImgWidth < secondImgLeft + secondImgWidth * 1.5){
                    curImg.style.top = secondImgTop - curImgHeight + 'px'
                    curImg.style.left = secondImgLeft + 'px'
                    pieces.push(i)
                    break
                }
            }
        }else if(i === num - 4){
            if(curImgTop - (secondImgTop + secondImgHeight) < 21 && curImgTop > secondImgTop + secondImgHeight){
                if(curImgLeft + curImgWidth > secondImgLeft - secondImgWidth/2 && curImgLeft + curImgWidth < secondImgLeft + secondImgWidth * 1.5){
                    curImg.style.left = secondImgLeft + 'px'
                    curImg.style.top = (secondImgTop + secondImgHeight) + 'px'
                    pieces.push(i)
                    break
                }
            }
        }
    }
    // if(pieces.length > k){
    //     let divPiece = ''
    //     for(let i of pieces){
    //         divPiece += puzzleImages[i].outerHTML
    //     }
        
    //     divPiece = '<div>' + divPiece + '</div>'
    //     for(let img of puzzleSection.querySelectorAll('img')){
    //         for(let i of pieces){
    //             if(img == puzzleImages[i]){
    //                 puzzleSection.remove(puzzleImages[i])
    //             }
    //         }
    //     }

    //     puzzleSection.innerHTML += divPiece
    //     puzzleSection.querySelector('div').style.left = 
    //     k += 1
    // }
    document.removeEventListener('mouseup', MoveStop)
    puzzleContainer.removeEventListener('mousemove', Moving)

    document.removeEventListener('touchend', MoveStop)
    puzzleContainer.removeEventListener('touchmove', Moving)
}