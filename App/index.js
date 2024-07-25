// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

const CELL_SIZE = 20;
const BOARD_SIZE = 300; // 300px x 300px board

const directions = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

const getRandomPosition = () => {
    const x = Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE));
    const y = Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE));
    return { x, y };
};

const Game = () => {
    const [snake, setSnake] = useState([{ x: 5, y: 5 }]);  // initial position
    const [food, setFood] = useState(getRandomPosition());
    const [direction, setDirection] = useState(directions.RIGHT);
    const [isPlaying, setIsPlaying] = useState(false);
    const gameLoopRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            gameLoopRef.current = setInterval(moveSnake, 200);
        } else {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        }
        return () => clearInterval(gameLoopRef.current);
    }, [isPlaying, snake, direction]);

    const moveSnake = () => {
        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        head.x += direction.x;
        head.y += direction.y;

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            setFood(getRandomPosition());
        } else {
            newSnake.pop();
        }

        if (checkCollision(head, newSnake)) {
            alert("Game Over");
            setIsPlaying(false);
        } else {
            setSnake(newSnake);
        }
    };

    const checkCollision = (head, snake) => {
        if (head.x < 0 || head.x >= BOARD_SIZE / CELL_SIZE || head.y < 0 || head.y >= BOARD_SIZE / CELL_SIZE) {
            return true;
        }

        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }

        return false;
    };

    const handleDirectionChange = (newDirection) => {
        if (
            (direction === directions.UP || direction === directions.DOWN) &&
            (newDirection === directions.UP || newDirection === directions.DOWN)
        ) {
            return;
        }
        if (
            (direction === directions.LEFT || direction === directions.RIGHT) &&
            (newDirection === directions.LEFT || newDirection === directions.RIGHT)
        ) {
            return;
        }
        setDirection(newDirection);
    };

    const startGame = () => {
        setSnake([{ x: 5, y: 5 }]);
        setDirection(directions.RIGHT);
        setFood(getRandomPosition());
        setIsPlaying(true);
    };

    return (
        <View style={styles.gameContainer}>
            <View style={styles.board}>
                {snake.map((segment, index) => (
                    <View key={index} style={[styles.cell, { top: segment.y * CELL_SIZE, left: segment.x * CELL_SIZE }]} />
                ))}
                <View style={[styles.cell, styles.food, { top: food.y * CELL_SIZE, left: food.x * CELL_SIZE }]} />
            </View>
            <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionChange(directions.UP)}>
                    <Text>UP</Text>
                </TouchableOpacity>
                <View style={styles.horizontalControls}>
                    <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionChange(directions.LEFT)}>
                        <Text>LEFT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionChange(directions.RIGHT)}>
                        <Text>RIGHT</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.controlButton} onPress={() => handleDirectionChange(directions.DOWN)}>
                    <Text>DOWN</Text>
                </TouchableOpacity>
            </View>
            {!isPlaying && (
                <Button title="Start Game" onPress={startGame} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        backgroundColor: '#bbb',
        position: 'relative',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        position: 'absolute',
        backgroundColor: 'green',
    },
    food: {
        backgroundColor: 'red',
    },
    controls: {
        marginTop: 20,
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButton: {
        padding: 10,
        backgroundColor: '#ccc',
        marginVertical: 5,
        alignItems: 'center',
    },
    horizontalControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

const App = () => {
    return (
        <SafeAreaView style={stylesApp.container}>
            <Text style={stylesApp.title}>Snake Game</Text>
            <Game />
        </SafeAreaView>
    );
}

const stylesApp = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default App;