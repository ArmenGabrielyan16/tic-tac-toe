import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let style = {};

    if (props.highlight) {
        style.backgroundColor = 'red';
    }

    return (
        <button className="square" style={style} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let highlight = this.props.winnerSquares.indexOf(i) === -1 ? false : true;
        return (
            <Square
                value={this.props.squares[i]}
                highlight={highlight}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderBoard() {
        let boardArray = [], i = 0;

        for (let rows = 0;rows < 3;rows++) {
            let rowsArray = [];

            for (let columns = 0;columns < 3;columns++) {
                rowsArray.push(this.renderSquare(i));
                i++;
            }

            boardArray.push(
                <div className="board-row">
                    {rowsArray}
                </div>
            );
        }

        return (
            <div>
                {boardArray}
            </div>
        );
    }

    render() {
        return (
            this.renderBoard()
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [
                {
                    squares: new Array(9).fill(null),
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares)[0] || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerSquares = calculateWinner(current.squares);
        const winner = winnerSquares[0];

        const moves = history.map((step, move) => {
            const desc = move ? 'Move ' + move : 'Game start';

            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </a>
                </li>
            );
        });

        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winnerSquares={winnerSquares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }

    return new Array(null);
}