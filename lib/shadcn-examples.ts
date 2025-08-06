import dedent from "dedent";

export const examples = {
  "pixel platformer": {
    prompt: "Build a pixel art platformer game",
    response: `
    import { useState, useEffect } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"

export default function PixelPlatformer() {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 200 })
  const [isJumping, setIsJumping] = useState(false)
  const [score, setScore] = useState(0)
  const [gameRunning, setGameRunning] = useState(false)

  const platforms = [
    { x: 0, y: 300, width: 400, height: 20 },
    { x: 450, y: 250, width: 100, height: 20 },
    { x: 600, y: 200, width: 100, height: 20 },
    { x: 750, y: 150, width: 100, height: 20 },
  ]

  const coins = [
    { x: 200, y: 150, collected: false },
    { x: 500, y: 200, collected: false },
    { x: 650, y: 150, collected: false },
  ]

  useEffect(() => {
    if (!gameRunning) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          setPlayerPos(prev => ({ ...prev, x: Math.max(0, prev.x - 10) }))
          break
        case 'ArrowRight':
          setPlayerPos(prev => ({ ...prev, x: Math.min(350, prev.x + 10) }))
          break
        case 'Space':
          if (!isJumping) {
            setIsJumping(true)
            setPlayerPos(prev => ({ ...prev, y: prev.y - 100 }))
            setTimeout(() => setIsJumping(false), 500)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameRunning, isJumping])

  useEffect(() => {
    if (!gameRunning) return

    const gameLoop = setInterval(() => {
      setPlayerPos(prev => {
        const newY = prev.y + 2
        const onPlatform = platforms.some(p => 
          prev.x + 20 > p.x && prev.x < p.x + p.width && 
          newY + 20 >= p.y && newY <= p.y + p.height
        )
        return { ...prev, y: onPlatform ? p.y - 20 : newY }
      })

      // Check coin collection
      coins.forEach((coin, index) => {
        if (!coin.collected && 
            playerPos.x < coin.x + 20 && playerPos.x + 20 > coin.x &&
            playerPos.y < coin.y + 20 && playerPos.y + 20 > coin.y) {
          setScore(prev => prev + 10)
          coins[index].collected = true
        }
      })
    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameRunning, playerPos])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Pixel Platformer</CardTitle>
        <div className="flex justify-between items-center">
          <span className="text-lg">Score: {score}</span>
          <Button 
            onClick={() => setGameRunning(!gameRunning)}
            variant={gameRunning ? "destructive" : "default"}
          >
            {gameRunning ? "Pause" : "Start"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-400 bg-sky-200 border-4 border-gray-800 overflow-hidden">
          {/* Player */}
          <div 
            className="absolute w-5 h-5 bg-red-500 border-2 border-red-700"
            style={{ 
              left: playerPos.x, 
              top: playerPos.y,
              transition: 'left 0.1s ease-out'
            }}
          />
          
          {/* Platforms */}
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="absolute bg-green-600 border-2 border-green-800"
              style={{
                left: platform.x,
                top: platform.y,
                width: platform.width,
                height: platform.height
              }}
            />
          ))}
          
          {/* Coins */}
          {coins.map((coin, index) => !coin.collected && (
            <div
              key={index}
              className="absolute w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rounded-full"
              style={{
                left: coin.x,
                top: coin.y
              }}
            />
          ))}
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-4 text-sm bg-black bg-opacity-50 text-white p-2 rounded">
            <p>Arrow Keys: Move | Space: Jump</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
    `,
  },
  "pixel rpg": {
    prompt: "Create a pixel art RPG game",
    response: `
    import { useState, useEffect } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"

export default function PixelRPG() {
  const [player, setPlayer] = useState({
    x: 100, y: 100, hp: 100, maxHp: 100, level: 1, exp: 0
  })
  const [enemies, setEnemies] = useState([
    { id: 1, x: 300, y: 100, hp: 50, maxHp: 50, type: 'goblin' },
    { id: 2, x: 200, y: 200, hp: 30, maxHp: 30, type: 'slime' },
  ])
  const [gameState, setGameState] = useState('exploring')
  const [message, setMessage] = useState('')

  const movePlayer = (dx: number, dy: number) => {
    if (gameState !== 'exploring') return
    
    setPlayer(prev => ({
      ...prev,
      x: Math.max(0, Math.min(350, prev.x + dx)),
      y: Math.max(0, Math.min(350, prev.y + dy))
    }))
  }

  const attackEnemy = (enemyId: number) => {
    const enemy = enemies.find(e => e.id === enemyId)
    if (!enemy) return

    const damage = Math.floor(Math.random() * 20) + 10
    const newHp = Math.max(0, enemy.hp - damage)
    
    setEnemies(prev => prev.map(e => 
      e.id === enemyId ? { ...e, hp: newHp } : e
    ))

    if (newHp === 0) {
      setMessage('Defeated ' + enemy.type + '!')
      setPlayer(prev => ({ ...prev, exp: prev.exp + 20 }))
      setTimeout(() => {
        setEnemies(prev => prev.filter(e => e.id !== enemyId))
        setGameState('exploring')
      }, 1000)
    } else {
      setMessage('Dealt ' + damage + ' damage to ' + enemy.type + '!')
    }
  }

  const enemyAttack = () => {
    const damage = Math.floor(Math.random() * 15) + 5
    setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - damage) }))
    setMessage('Enemy dealt ' + damage + ' damage!')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp': movePlayer(0, -20); break
        case 'ArrowDown': movePlayer(0, 20); break
        case 'ArrowLeft': movePlayer(-20, 0); break
        case 'ArrowRight': movePlayer(20, 0); break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  useEffect(() => {
    // Check for encounters
    enemies.forEach(enemy => {
      const distance = Math.sqrt(
        Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
      )
      if (distance < 30 && gameState === 'exploring') {
        setGameState('combat')
        setMessage('Encountered ' + enemy.type + '!')
      }
    })
  }, [player, enemies, gameState])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Pixel RPG Adventure</CardTitle>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p>Level: {player.level} | HP: {player.hp}/{player.maxHp}</p>
            <p>EXP: {player.exp}</p>
          </div>
          <div className="text-sm text-gray-600">
            {gameState === 'exploring' ? 'Exploring' : 'In Combat'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-400 bg-green-200 border-4 border-gray-800 overflow-hidden">
          {/* Player */}
          <div 
            className="absolute w-6 h-6 bg-blue-500 border-2 border-blue-700"
            style={{ 
              left: player.x, 
              top: player.y,
              transition: 'all 0.1s ease-out'
            }}
          />
          
          {/* Enemies */}
          {enemies.map(enemy => (
            <div
              key={enemy.id}
              className="absolute w-6 h-6 border-2"
              style={{
                left: enemy.x,
                top: enemy.y,
                backgroundColor: enemy.type === 'goblin' ? '#8B4513' : '#90EE90',
                borderColor: enemy.type === 'goblin' ? '#654321' : '#228B22'
              }}
            />
          ))}
          
          {/* Combat UI */}
          {gameState === 'combat' && enemies.length > 0 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded">
              <h3 className="font-bold mb-2">Combat</h3>
              {enemies.map(enemy => (
                <div key={enemy.id} className="mb-2">
                  <p>{enemy.type} HP: {enemy.hp}/{enemy.maxHp}</p>
                  <Button 
                    size="sm" 
                    onClick={() => attackEnemy(enemy.id)}
                    className="mt-1"
                  >
                    Attack
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Message */}
          {message && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded">
              {message}
            </div>
          )}
          
          {/* Instructions */}
          <div className="absolute bottom-4 right-4 text-sm bg-black bg-opacity-50 text-white p-2 rounded">
            <p>Arrow Keys: Move</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
    `,
  },
  "pixel puzzle": {
    prompt: "Make a pixel art puzzle game",
    response: `
    import { useState, useEffect } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"

export default function PixelPuzzle() {
  const [board, setBoard] = useState<number[][]>([])
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)
  const [size, setSize] = useState(3)

  const initializeBoard = (boardSize: number) => {
    const numbers = Array.from({ length: boardSize * boardSize - 1 }, (_, i) => i + 1)
    numbers.push(0) // Empty space
    
    // Shuffle the array
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }
    
    const newBoard = []
    for (let i = 0; i < boardSize; i++) {
      newBoard.push(numbers.slice(i * boardSize, (i + 1) * boardSize))
    }
    
    setBoard(newBoard)
    setMoves(0)
    setSolved(false)
  }

  useEffect(() => {
    initializeBoard(size)
  }, [size])

  const findEmptyPosition = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) return { row: i, col: j }
      }
    }
    return null
  }

  const canMove = (row: number, col: number) => {
    const empty = findEmptyPosition()
    if (!empty) return false
    
    return (Math.abs(row - empty.row) === 1 && col === empty.col) ||
           (Math.abs(col - empty.col) === 1 && row === empty.row)
  }

  const moveTile = (row: number, col: number) => {
    if (!canMove(row, col)) return
    
    const empty = findEmptyPosition()!
    const newBoard = board.map(row => [...row])
    
    // Swap the clicked tile with the empty space
    newBoard[empty.row][empty.col] = board[row][col]
    newBoard[row][col] = 0
    
    setBoard(newBoard)
    setMoves(prev => prev + 1)
    
    // Check if puzzle is solved
    checkSolved(newBoard)
  }

  const checkSolved = (currentBoard: number[][]) => {
    const expected = []
    for (let i = 1; i < size * size; i++) {
      expected.push(i)
    }
    expected.push(0)
    
    const current = currentBoard.flat()
    if (JSON.stringify(current) === JSON.stringify(expected)) {
      setSolved(true)
    }
  }

  const getTileColor = (value: number) => {
    if (value === 0) return 'bg-gray-300'
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ]
    return colors[(value - 1) % colors.length]
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Pixel Puzzle Slider</CardTitle>
        <div className="flex justify-between items-center">
          <span>Moves: {moves}</span>
          <div className="space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setSize(3)}
            >
              3x3
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setSize(4)}
            >
              4x4
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Game Board */}
          <div 
            className="grid gap-1 border-4 border-gray-800 p-2 bg-gray-200"
            style={{ 
              gridTemplateColumns: 'repeat(' + size + ', 1fr)',
              width: (size * 80) + 'px',
              height: (size * 80) + 'px'
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <div
                  key={rowIndex + '-' + colIndex}
                  className={
                    'w-20 h-20 border-2 border-gray-800 flex items-center justify-center ' +
                    'text-white font-bold text-xl cursor-pointer transition-all ' +
                    (value === 0 ? 'bg-gray-300' : getTileColor(value)) +
                    (canMove(rowIndex, colIndex) ? ' hover:scale-105' : '')
                  }
                  onClick={() => moveTile(rowIndex, colIndex)}
                >
                  {value !== 0 && value}
                </div>
              ))
            )}
          </div>
          
          {/* Controls */}
          <div className="space-x-2">
            <Button onClick={() => initializeBoard(size)}>
              New Game
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const empty = findEmptyPosition()
                if (empty) {
                  moveTile(empty.row, empty.col)
                }
              }}
            >
              Shuffle
            </Button>
          </div>
          
          {/* Victory Message */}
          {solved && (
            <div className="text-center p-4 bg-green-100 border-2 border-green-500 rounded">
              <h3 className="text-xl font-bold text-green-800">Puzzle Solved!</h3>
              <p className="text-green-600">Moves: {moves}</p>
            </div>
          )}
          
          {/* Instructions */}
          <div className="text-sm text-gray-600 text-center">
            <p>Click tiles adjacent to the empty space to move them</p>
            <p>Arrange numbers in order from 1 to {size * size - 1}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
    `,
  },
  "pixel arcade": {
    prompt: "Create a pixel art arcade game",
    response: `
    import { useState, useEffect } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"

export default function PixelArcade() {
  const [player, setPlayer] = useState({ x: 200, y: 350 })
  const [bullets, setBullets] = useState<Array<{x: number, y: number, id: number}>>([])
  const [enemies, setEnemies] = useState<Array<{x: number, y: number, id: number}>>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (!gameRunning) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          setPlayer(prev => ({ ...prev, x: Math.max(0, prev.x - 10) }))
          break
        case 'ArrowRight':
          setPlayer(prev => ({ ...prev, x: Math.min(390, prev.x + 10) }))
          break
        case 'Space':
          setBullets(prev => [...prev, { x: player.x + 15, y: player.y, id: Date.now() }])
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameRunning, player])

  useEffect(() => {
    if (!gameRunning) return

    const gameLoop = setInterval(() => {
      // Move bullets
      setBullets(prev => prev
        .map(bullet => ({ ...bullet, y: bullet.y - 5 }))
        .filter(bullet => bullet.y > 0)
      )

      // Move enemies
      setEnemies(prev => prev.map(enemy => ({ ...enemy, y: enemy.y + 2 })))

      // Spawn enemies
      if (Math.random() < 0.02) {
        setEnemies(prev => [...prev, { 
          x: Math.random() * 380, 
          y: -20, 
          id: Date.now() 
        }])
      }

      // Check bullet-enemy collisions
      setBullets(prev => {
        const newBullets = [...prev]
        setEnemies(prevEnemies => {
          const newEnemies = [...prevEnemies]
          
          newBullets.forEach((bullet, bulletIndex) => {
            newEnemies.forEach((enemy, enemyIndex) => {
              if (Math.abs(bullet.x - enemy.x) < 20 && Math.abs(bullet.y - enemy.y) < 20) {
                newBullets.splice(bulletIndex, 1)
                newEnemies.splice(enemyIndex, 1)
                setScore(prev => prev + 10)
              }
            })
          })
          
          return newEnemies
        })
        return newBullets
      })

      // Check player-enemy collisions
      setEnemies(prev => {
        const newEnemies = prev.filter(enemy => {
          if (Math.abs(player.x - enemy.x) < 30 && Math.abs(player.y - enemy.y) < 30) {
            setLives(prev => prev - 1)
            return false
          }
          return enemy.y < 400
        })
        return newEnemies
      })

      // Remove enemies that pass the bottom
      setEnemies(prev => prev.filter(enemy => enemy.y < 400))
    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameRunning, player])

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true)
      setGameRunning(false)
    }
  }, [lives])

  const startGame = () => {
    setPlayer({ x: 200, y: 350 })
    setBullets([])
    setEnemies([])
    setScore(0)
    setLives(3)
    setGameOver(false)
    setGameRunning(true)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Pixel Space Shooter</CardTitle>
        <div className="flex justify-between items-center">
          <span>Score: {score}</span>
          <span>Lives: {lives}</span>
          <Button 
            onClick={() => setGameRunning(!gameRunning)}
            variant={gameRunning ? "destructive" : "default"}
            disabled={gameOver}
          >
            {gameRunning ? "Pause" : "Start"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-400 bg-black border-4 border-gray-800 overflow-hidden">
          {/* Player */}
          <div 
            className="absolute w-8 h-8 bg-blue-500 border-2 border-blue-700"
            style={{ 
              left: player.x, 
              top: player.y,
              transition: 'left 0.1s ease-out'
            }}
          />
          
          {/* Bullets */}
          {bullets.map(bullet => (
            <div
              key={bullet.id}
              className="absolute w-2 h-4 bg-yellow-400"
              style={{
                left: bullet.x,
                top: bullet.y
              }}
            />
          ))}
          
          {/* Enemies */}
          {enemies.map(enemy => (
            <div
              key={enemy.id}
              className="absolute w-6 h-6 bg-red-500 border-2 border-red-700"
              style={{
                left: enemy.x,
                top: enemy.y
              }}
            />
          ))}
          
          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                <p className="mb-4">Final Score: {score}</p>
                <Button onClick={startGame}>Play Again</Button>
              </div>
            </div>
          )}
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-4 text-sm bg-black bg-opacity-50 text-white p-2 rounded">
            <p>Arrow Keys: Move | Space: Shoot</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
    `,
  },
};
