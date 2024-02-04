import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Fireworks } from 'fireworks-js'
import './index.css';
import loongGif from '../../assets/loong.gif';
import loongPng from '../../assets/loong.png';
import backMusic from '../../assets/back.mp3';
import musicIcon from '../../assets/music.png';
import resetIcon from '../../assets/reset.png';
import explosion0 from '../../assets/explosion0.mp3';
import explosion1 from '../../assets/explosion1.mp3';
import explosion2 from '../../assets/explosion2.mp3';
function Lottery() {
    // show winners name
    const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [names, setNames] = useState([]);
    const [morePrizes, setMorePrizes] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(null as any);
    const [firstEnter, setFirstEnter] = useState(false);
    const [rolling, setRolling] = useState(false);
    // set current prize
    const [prize, setPrize] = useState('');
    const [winners, setWinners] = useState([]);
    // prize limits
    const [prizeLimits, setPrizeLimits] = useState({} as any);
    // firework
    const [fireworks, setFireworks] = useState(null as any);
    //lottery title
    const [title,setTitle] = useState('');
    // prize list
    const [prizeList, setPrizeList] = useState([] as any);
    // prize list title
    const [winnerListTitle, setWinnerListTitle] = useState([] as any);
    // setPenultimate prize  last but one
    const [penultimate, setPenultimate] = useState('');
    // setlast prize  last
    const [lastPrize, setlastPrize] = useState('');

    //set from local
    const [fromLocal, setfromLocal] = useState(false);

    /**
     * @description: read config.json
     * @return {*}
     */    
    useEffect(() => {
        fetch('/config.json')
        .then((response) => response.json())
        .then((config:any) => {
        //   console.log(config)
            setPrizeLimits(config.prizeLimits)
            setPrize(config.prizeList[0])
            
            setTitle(config.title)
            setPrizeList(config.prizeList)
            setWinnerListTitle(config.winnerListTitle)
            setPenultimate(config.prizeList[config.prizeList.length - 2])
            setlastPrize(config.prizeList[config.prizeList.length - 1])
            const storedWinners = JSON.parse(localStorage.getItem('winners') || '[]');
            if(storedWinners.length == config.names.length){
                setfromLocal(true);
                setNames([]);
            }else{
                const remainingNames = config.names.filter((name:any) => 
                    !storedWinners.some((winner:any) => winner.name === name)
                );
                setNames(remainingNames);
            }
        })
      }, []);

    /**
     * @description: check if from local
     * @return {*}
     */    
    useEffect(() => {
        const storedWinners = JSON.parse(localStorage.getItem('winners') || '[]');
        if (storedWinners.length > 0) {
            setWinners(storedWinners);
            setFirstEnter(true);
        }

        const storedCurrentIndex = localStorage.getItem('currentIndex');
        const storedPrize = localStorage.getItem('prize');
        const storedNames = JSON.parse(localStorage.getItem('names') || '[]');
        if (storedCurrentIndex) {
            setCurrentIndex(parseInt(storedCurrentIndex, 10) as any);
        }
    
        if (storedPrize) {
            console.log('storedPrize',storedPrize)
            setPrize(storedPrize);
        }
    
        if (storedNames.length > 0) {
            setNames(storedNames);
        }
    }, []);

    /**
     * @description: monitor
     * @return {*}
     */    
    useEffect(() => {
        if(winners.length > 0){
            localStorage.setItem('winners', JSON.stringify(winners));
        }
    }, [winners]);
    
    useEffect(() => {
       if (currentIndex !== null) {
            localStorage.setItem('currentIndex', currentIndex.toString() as any);
        }
    }, [currentIndex]);
    
    useEffect(() => {
        localStorage.setItem('prize', prize);
    }, [prize]);
    
    useEffect(() => {
        localStorage.setItem('names', JSON.stringify(names));
    }, [names]);
    
    /**
     * @description: init fireworks
     * @return {*}
     */    
    useEffect(() => {
        const container = document.querySelector('.container');
        const newFireworks = new Fireworks(container as any, {
            autoresize: true,
            opacity: 0.5,
            acceleration: 1.05,
            friction: 0.97,
            gravity: 1.5,
            particles: 50,
            traceLength: 3,
            traceSpeed: 10,
            explosion: 5,
            intensity: 30,
            flickering: 50,
            lineStyle: 'round',
            hue: {
              min: 0,
              max: 360
            },
            delay: {
              min: 30,
              max: 60
            },
            rocketsPoint: {
              min: 50,
              max: 50
            },
            lineWidth: {
              explosion: {
                min: 1,
                max: 3
              },
              trace: {
                min: 1,
                max: 2
              }
            },
            brightness: {
              min: 50,
              max: 80
            },
            decay: {
              min: 0.015,
              max: 0.03
            },
            mouse: {
              click: false,
              move: false,
              max: 1
            },
            sound: {
                enabled: true,
                files: [
                    explosion0,
                    explosion1,
                    explosion2
                ],
                volume: {
                    min: 100,
                    max: 100
                }
            }
          })
        setFireworks(newFireworks as any);
        return () => {
            if (newFireworks) {
                newFireworks.stop();
            }
        };
    }, []);

    /**
     * @description: init music and monitor key
     * @return {*}
     */    
    useEffect(() => {
        //check space key
        let debounceTimer: string | number | NodeJS.Timeout | null | undefined;
        const handleKeyPress = (event: { keyCode: number; }) => {
            const music:any = document.getElementById('background-music');
            music.play().catch((error:any) => console.log("Auto-play was prevented by the browser"));
            const musicButton:any = document.getElementById('music-button');
            musicButton.classList.add('playing');
            if (event.keyCode === 32) {
               setFirstEnter(true)
               if (!debounceTimer) {
                    toggleRolling();
                    debounceTimer = setTimeout(() => {
                       debounceTimer = null;
                    }, 300);
                }
           }
        };
        window.addEventListener('keydown', handleKeyPress);

        let interval: string | number | NodeJS.Timeout | undefined;
        if (rolling) {
            interval = setInterval(() => {
                    const randomIndex = Math.floor(Math.random() * names.length);
                    setCurrentIndex(randomIndex as any);
                
            }, 100);
        };
        
        
        return () => {
            clearInterval(interval);
            clearTimeout(debounceTimer as any);//
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [rolling, names, currentIndex]);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @description: change title
     * @return {*}
     */    
    const adjustTitleForScreenshot = () => {
        const elements = document.querySelectorAll('.take-color');
        console.log('elements',elements)
        elements.forEach((el:any) => {
            el.style.background = 'none';
            el.style.color = '#ffd700';
            el.style.webkitBackgroundClip = 'none';
            el.style.backgroundClip = 'border-box';
        });
    };
    
    /**
     * @description: restoreTitleAfterScreenshot
     * @return {*}
     */    
    const restoreTitleAfterScreenshot = () => {
        const elements = document.querySelectorAll('.take-color');
        elements.forEach((el:any) => {
            el.style.background = 'linear-gradient(to right, #ffd700, #f8b500, #ffb347, #ffd700)';
            el.style.color = 'transparent';
            el.style.webkitBackgroundClip = 'text';
            el.style.backgroundClip = 'text';
        });
  };

    /** 
     * @description: takeScreenshot
     * @return {*}
     */    
    const takeScreenshot = () => {
        adjustTitleForScreenshot();
        const element = document.body;
        html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            downloadImage(imgData, 'screenshot.png');
            restoreTitleAfterScreenshot();
        });
    };
    
    /**
     * @description: download image
     * @param {any} dataUrl
     * @param {any} filename
     * @return {*}
     */    
    const downloadImage = (dataUrl:any, filename:any) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @description: group by prize
     * @param {*} winners
     * @return {*}
     */    
    const groupedWinners = winners.reduce((acc:any, winner:any) => {
        if (!acc[winner.prize]) {
          acc[winner.prize] = [];
        }
        acc[winner.prize].push(winner);
        return acc;
      }, {});

    /**
     * @description: get next element
     * @param {any} array
     * @param {any} element
     * @return {*}
     */    
    const getNextElement = (array:any, element:any) => {
        const index = array.indexOf(element);
        if (index !== -1 && index < array.length - 1) {
          return array[index + 1];
        }
        return undefined;
      }
    
    /**
     * @description: adjust volume
     * @param {number} volume
     * @return {*}
     */    
    const adjustVolume = (volume:number) => {
        const music:any = document.getElementById('background-music');
        if (music) {
            music.volume = volume;
        }
    };
    
    /**
     * @description: start rolling
     * @return {*}
     */    
    const toggleRolling = () => {
        if(fromLocal) return
        if(names.length > 0 && !isAnimating){
            setRolling(!rolling);
            if (rolling) {
                setIsAnimating(true); 
                if (fireworks) {
                    fireworks.start();
                    adjustVolume(0.3)
                }
                setShowWinnerAnimation(true); // 开始显示动画
                setTimeout(() => {
                    setShowWinnerAnimation(false); // 动画结束
                    const winnerName = names[currentIndex as any];
                    const currentPrizeWinners = winners.filter((winner:any) => winner.prize === prize).length;
                    console.log(prize)
                    console.log(winners)
                    // return
                    if (currentPrizeWinners < prizeLimits[prize]) {
                        setWinners(currentWinners => [...currentWinners, { name: winnerName, prize }] as any);
                        setNames(currentNames => currentNames.filter((_, index) => index !== currentIndex));
                    } 
                    fireworks.stop();
                    adjustVolume(1)
                    if (prize === penultimate && currentPrizeWinners + 1 === prizeLimits[prize]) {
                        //if current is second,stop rolling 
                        const remainingWinners = names.filter((_, index) => index !== currentIndex).map(name => ({ name, prize: lastPrize }));
                        setWinners(currentWinners => [...currentWinners, ...remainingWinners] as any);
                        setNames([]);
                        setRolling(false);
                        //hidde the button
                        setMorePrizes(false); 
                        fireworks.start();
                        
                        setTimeout(() => {
                            takeScreenshot();
                        },5000);

                    } else if (prize != penultimate && currentPrizeWinners + 1 === prizeLimits[prize]) {
                        setPrize(getNextElement(prizeList, prize))
                    }
                    setIsAnimating(false); 
                }, 4000)
            }
            
        }
        
    };
    
    /**
     * @description: monitor music
     * @return {*}
     */    
    const toggleMusic = () => {
        const music:any = document.getElementById('background-music');
        const musicButton:any = document.getElementById('music-button');
        if (music.paused) {
          music.play();
          musicButton.classList.add('playing');
        } else {
          music.pause();
          musicButton.classList.remove('playing');
        }
      };
    
    /**
     * @description: reset
     * @return {*}
     */      
    const reset = () => {
        localStorage.clear();
        location.reload();
    }
      
    return (
        <div className='lottory h-screen w-full text-center pt-16'>
            <div className="music-container">
            <audio id="background-music" loop>
                <source src={backMusic} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <div id="reset-button" onClick={reset}>
                <img src={resetIcon} id="music-icon"/>
            </div>
            <div id="music-button" onClick={toggleMusic}>
                <img src={musicIcon} id="music-icon"/>
            </div>
            </div>

            <div className='item-title take-color'>{`${title}`}</div>
            {morePrizes && !fromLocal && (
                <>
                    <div className='show-name flex items-center justify-center'>
                        {(currentIndex !== null && rolling && names[currentIndex] !== undefined)  ? `${names[currentIndex]}` : ''}
                    </div>
                </>
            )}
            {rolling && (
                <div className='loogn-div'>
                    <img src={loongGif} className="loogn loogn-fan" />
                    <img src={loongGif} className="loogn" />
                </div>
            )}
            {!rolling && (
                <div className='loogn-div'>
                    <img src={loongPng} className="loogn loogn-fan" />
                    <img src={loongPng} className="loogn" />
                </div>
            )}
            {showWinnerAnimation && 
             <div className='winner-center'>  
                <div className="winner-animation z-50">{`${prize}: ${names[currentIndex as any]}`}</div>
             </div>
            }
           
            <div className="container fixed top-0 right-0 bottom-0 left-0 z-50 max-w-none">
                
            </div>
            <div className='prize-show'>
                
            {firstEnter && (<h3 className='prize-title take-color'>{`${winnerListTitle}`}</h3>)}
                {Object.keys(groupedWinners).map(prizeLevel => (
                    <div key={prizeLevel}>
                        <h4 className='prize-level take-color'>{prizeLevel}</h4>
                        <ul  className='winners-grid'>
                            {groupedWinners[prizeLevel].map((winner:any, index:number) => (
                            <li key={index}>
                                <div className='prize-name grid-item'>{winner.name}</div>
                            </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Lottery;
