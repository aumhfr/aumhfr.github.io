document.addEventListener('DOMContentLoaded', () => {
    const smallgrid = document.querySelector('.smallgrid')
    let width = 10
    let mineCount = 15
    let flags = 0
    let tiles = []
    let lossState = false
    let openTile = 0

    // text element
    let textElement = "<b>Minesweeper Operations in the Baltic:</b><br><br>The rules of minesweeper are simple. This 10x10 array has 15 mines in it. To win, you must uncover all of the tiles that don't have mines on them.<br><br>To begin, knock on some wood and click a tile. If it's not a mine, a tile or a section of tiles will be uncovered. Uncovered tiles with numbers on them will tell you the amount of adjacent (including diagonally) tiles. Use this information to avoid the tiles you think are mined to uncover the 85 that are not.<br><br>If you right click on an unclicked tile, you can place a flag on it so that you won't accidentally click it. Right click on the flag to remove it.<br><br>Good luck. You can click on the yellow face at any time to reset the game.";
    document.getElementById('text').innerHTML = textElement;

    function createBoard() {
        // scatter mines onto the board randomly
        const MINE_TILES = Array(mineCount).fill('mine')
        const EMPTY_TILES = Array(width*width - mineCount).fill('clicky')
        const COMBINED_TILES = EMPTY_TILES.concat(MINE_TILES)
        const RANDOMIZED_TILES = COMBINED_TILES.sort(() => Math.random() - 0.5) /* look into sorting with Fisher-Yates shuffle */
    
        // create the actual board and its tiles
        for (let i = 0; i < width*width; i++) {
            const tile = document.createElement('div')
            tile.setAttribute('id', i)
            tile.classList.add(RANDOMIZED_TILES[i])
            smallgrid.appendChild(tile)
            tiles.push(tile)

            tile.addEventListener('click', function(e) {
                click(tile)
            })

            tile.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(tile)
            }

        }

        //tile numbers / mine detection
        for (let i=0; i < tiles.length; i++) {
            let count = 0
            const LEFT_EDGE = i % width === 0
            const RIGHT_EDGE = i % width === width -1
            //detection count
            if (tiles[i].classList.contains('clicky')) {
                if (i > 0 && !LEFT_EDGE && tiles[i-1].classList.contains('mine')) count++ // left
                if (i >= 0 && !RIGHT_EDGE && tiles[i+1].classList.contains('mine')) count++ // right
                if (i >= width && tiles [i-width].classList.contains('mine')) count++ // up
                if (i < (width*width-width) && i >= 0 && tiles[i+width].classList.contains('mine')) count++ // down
                if (i >= width && !LEFT_EDGE && tiles[i-width-1].classList.contains('mine')) count++ // up + left
                if (i >= width && !RIGHT_EDGE && tiles[i-width+1].classList.contains('mine')) count++ // up + right
                if (i < (width*width-width) && !LEFT_EDGE && tiles[i+width-1].classList.contains('mine')) count++ // down + left
                if (i < (width*width-width) && !RIGHT_EDGE && tiles[i+width+1].classList.contains('mine')) count++ // down + right
                tiles[i].setAttribute('data',count)
                switch ('data', count) {
                    case 2:
                        tiles[i].style.color = "white";
                        break;
                    case 3:
                        tiles[i].style.color = "cyan";
                        break;
                    case 4:
                        tiles[i].style.color = "yellow";
                        break;
                    case 5:
                        tiles[i].style.color = "brown"
                        break;
                    case 6:
                        tiles[i].style.color = "orange"
                        break;
                    case 7:
                        tiles[i].style.color = "purple"
                        break;
                    case 8:
                        tiles[i].style.color = "red"
                        break;
                    default:
                        tiles[i].style.color = "rgb(7, 190, 7)";
                        break;
                }
            }
        }
    }
    createBoard()

    // add flags

    function addFlag (tile){
        if (lossState) return
        if (!tile.classList.contains('clicked') && (flags < mineCount)) {
            if (!tile.classList.contains('flag')) {
                tile.classList.add('flag')
                tile.innerHTML = "<img src = mineimages/flag.png>"

                let flagStatement = (Math.floor(Math.random() * 3))
                if (flagStatement == 0) {
                    let textElement = "Adding flag to designated tile.";
                    document.getElementById('text').innerHTML = textElement;
                } else if (flagStatement == 1) {
                    let textElement = "A mine there? Are you sure?";
                    document.getElementById('text').innerHTML = textElement;
                } else {
                    let textElement = "Acknowledged. Mine flagged for removal."
                    document.getElementById('text').innerHTML = textElement;
                }
                
            } else {
                tile.classList.remove('flag')
                tile.innerHTML=""

                let flagRemoval = (Math.floor(Math.random() * 3))
                if (flagRemoval == 0) {
                    let textElement = "Removing flag from designated tile.";
                    document.getElementById('text').innerHTML = textElement;
                } else if (flagRemoval == 1) {
                    let textElement = "So there's not a mine there?";
                    document.getElementById('text').innerHTML = textElement;
                } else {
                    let textElement = "Acknowledged. We'll reinvestigate that section.";
                    document.getElementById('text').innerHTML = textElement;
                }
            }
        }
    }

    function click(tile){
        let tileID = tile.id
        if (lossState) return
        if (tile.classList.contains('clicked') || tile.classList.contains('flag')) return
        if (tile.classList.contains('mine')) {
            if (openTile < 10) {
                let textElement = "<b>Ouch! I'm afraid that's just bad luck.</b><br><br><b>Damage report: Critical damage sustained.</b><br><br>We've struck a mine and our hull is buckling! All hands, abandon ship!<br><br>During World War II, many countries faced diminishing navies due to the number of treaties following the first Great War. Because of this, many nations employed the use of mines as a secondary method of defense. Over the course of the War, over a thousand Axis ships and over four hundred Allied ships were sunk by mines.<br><br>At least 125 Allied minesweepers were sunk over the course of the war.<br><br><b>Game over.</b>";
                document.getElementById('text').innerHTML = textElement;
            } else {
                let textElement = "<b>Damage report: Critical damage sustained.</b><br><br>We've struck a mine and our hull is buckling! All hands, abandon ship!<br><br>During World War II, many countries faced diminishing navies due to the number of treaties following the first Great War. Because of this, many nations employed the use of mines as a secondary method of defense. Over the course of the War, over a thousand Axis ships and over four hundred Allied ships were sunk by mines.<br><br>At least 125 Allied minesweepers were sunk over the course of the war.<br><br><b>Game over.</b>";
                document.getElementById('text').innerHTML = textElement;
            }
            document.getElementById("reset").src="mineimages/mineDeath.png";
        gameOver (tile)
        } else {
            let clickStatement = (Math.floor(Math.random() * 10))
            if (clickStatement == 0) {
                let textElement = "Careful, our sonar has detected an array of mines.";
                document.getElementById('text').innerHTML = textElement;
            } else if (clickStatement == 1) {
                let textElement = "Although mines were used primarily for defensive operations, they were also used offensively by being laid in enemy waters, either destroying antagonistic ships or forcing them to use different routes. These tactics would prove to be detrimental to trade routes, damaging factions economically.";
                document.getElementById('text').innerHTML = textElement;
            }
            else if (clickStatement == 2) {
                let textElement = "The Fugas-class minesweeper was constructed for the Soviet Navy from 1938 to 1947, consisting of 44 vessels. Although many were sunk during the War or scrapped after it ended, two ships - namely T-2 Tros and T-8 Cheka, were transferred to the North Korean Navy in the 1950s and remain there to this day.";
                document.getElementById('text').innerHTML = textElement;
            }
            else if (clickStatement == 3) {
                let textElement = "That right there is a mine. A mine.";
                document.getElementById('text').innerHTML = textElement;
            }
            else if (clickStatement == 4) {
                let textElement = "So far, so good. We still have a few more sections to cover.";
                document.getElementById('text').innerHTML = textElement;
            }
            else if (clickStatement == 5) {
                let textElement = "Oh, there's a mine. Don't forget, you can flag it by right-clicking on its tile.";
                document.getElementById('text').innerHTML = textElement;
            }
            else if (clickStatement == 6) {
                let textElement = "The Fugas-class minesweeper was equipped for long voyages, being made up of nine water-proof compartments and boasting comforts such as central heating, a sauna, and a cinema apparatus.";
                document.getElementById('text').innerHTML = textElement;
            }
            else if (clickStatement == 7) {
                let textElement = "Most minesweepers during World War II were relatively light, displaced at around 500 tons and only being roughly 60 meters long. They were capable of reaching over 7,000 nautical miles at 17-18 knots and were equipped with small, singular cannons, machine guns, anti-aircraft artillery, and anti-submarine mortars and depth charges. ";
                document.getElementById('text').innerHTML = textElement;
            }
            else if (clickStatement == 8) {
                let textElement = "Minesweepers still see limited use in the modern day. In 2013, the British Royal Navy reformed the 9th Mine Countermeasures Squadron from the old 9th Mine Sweeping Squadron (1962-1971). The squadron is responsible for mine warfare in the Persian Gulf region and is based in Bahrain.";
                document.getElementById('text').innerHTML = textElement;
            }
            else if (clickStatement == 9) {
                let textElement = "Many of the minesweepers employed during the Second World War were converted civilian ships.";
                document.getElementById('text').innerHTML = textElement;
            }
            let count = tile.getAttribute('data')
            if (count !=0) {
                tile.classList.add('clicked')
                tile.innerHTML = count;
                openTile++
                console.log(openTile)
                winState()
                return
            }
            checkTile (tile, tileID)
        }
    tile.classList.add('clicked')
    }
    function checkTile(tile, tileID) {
        const LEFT_EDGE = (tileID % width === 0)
        const RIGHT_EDGE = (tileID % width === width -1)

        setTimeout(() => {
            if (tileID > 0 && !LEFT_EDGE) {
                const newID = tiles[parseInt(tileID) - 1].id // left
                const newTile = document.getElementById(newID)
                click(newTile)
            }
            if (tileID >= 0 && !RIGHT_EDGE) {
                const newID = tiles[parseInt(tileID) + 1].id // right
                const newTile = document.getElementById(newID)
                click(newTile)
            }
            if (tileID >= width) {
                const newID = tiles[parseInt(tileID) - width].id // up
                const newTile = document.getElementById(newID)
                click(newTile)
            }
            if (tileID >= 0 && tileID < width*width-width) {
                const newID = tiles[parseInt(tileID) + width].id // down
                const newTile = document.getElementById(newID)
                click(newTile)
            }
            if (tileID >= width && !LEFT_EDGE) {
                const newID = tiles[parseInt(tileID) - width - 1].id // up + left
                const newTile = document.getElementById(newID)
                click(newTile)
            }
            if (tileID >= width && !RIGHT_EDGE) {
                const newID = tiles[parseInt(tileID) - width + 1].id // up + right
                const newTile = document.getElementById(newID)
                click(newTile)
            }
            if (tileID >= 0 && tileID < width*width-width && !LEFT_EDGE) {
                const newID = tiles[parseInt(tileID) + width - 1].id // down + left
                const newTile = document.getElementById(newID)
                click(newTile)
            }
            if (tileID >= 0 && tileID < width*width-width && !RIGHT_EDGE) {
                const newID = tiles[parseInt(tileID) + width + 1].id // down + right
                const newTile = document.getElementById(newID)
                click(newTile)
            }
            openTile++
            console.log(openTile)
            winState()
        }, 10)
    }
    // game over function
    function gameOver (tile){
        lossState = true
        tiles.forEach(tile => {
            if (tile.classList.contains('mine')) {
                tile.innerHTML="<img src = mineimages/mine.png>"
            }
        })
    }

    // win state
    function winState() {
            if (openTile === (width*width-mineCount)) {
                let textElement = "<b>Minesweeper operations in the Baltic:<br>Success! All mines isolated.</b><br><br>Naval mines weren't technologically exclusive to World War II. Dating as far back as the 14th century, they were originally used by the Chinese to counter Japanese pirates by sealing explosives in a wooden box before being detonated from afar by having ripcords pulled to create sparks. The explosive devices saw constant use and technological improvements through the following centuries, eventually leading to the magnetic mines introduced during the first Great War. During World War II, they continued to see technological changes, allowing them to be deployed from planes and U-boats. During this time, between 600,000 and 1,000,000 naval mines were deployed, and thousands still remain in the world's seas to this day.<br><br><b>Congratulations, you win!</b>";
                document.getElementById('text').innerHTML = textElement;
                lossState=true
        }
    }

})
