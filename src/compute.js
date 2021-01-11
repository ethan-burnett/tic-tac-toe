export function optimalMove(board, player) {
    if (is_terminal(board)) return null;
    let value = Number.NEGATIVE_INFINITY;
    let best_action = null;
    let alpha = Number.NEGATIVE_INFINITY;
    let beta = Number.POSITIVE_INFINITY;
    const acts = actions(board);
    for (let i = 0; i < acts.length; i++) {
        const action = acts[i];
        apply(action, board, player);
        const new_value = min_value(board, alpha, beta, opponent(player));
        apply(action, board, null);
        if (value < new_value) {
            [value, best_action] = [new_value, action];
        }
        alpha = Math.max(alpha, value)
    }
    return best_action
}

export function calculateWinner(squares) {
    for (let i = 0; i < WINNER_LINES.length; i++) {
        const [a, b, c] = WINNER_LINES[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


//********** Helper Functions **********

const WINNER_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
const HEURISTIC_ARRAY = [
    [0, -10, -100, -1000],
    [10, 0, 0, 0],
    [100, 0, 0, 0],
    [1000, 0, 0, 0]
];

function utility(state, player) {
    let value = 0;
    for (let l = 0; l < WINNER_LINES.length; l++) {
        const line = WINNER_LINES[l];
        let players = 0;
        let others = 0;
        for (let i = 0; i < line.length; i++) {
            const piece = state[line[i]];
            if (piece === player){
                players += 1;
            } else if (piece === opponent(player)) {
                others += 1;
            }
        }
        value += HEURISTIC_ARRAY[players][others];
    }
    return value;
}

function actions(state) {
    let acts = [];
    for (let i = 0; i < state.length; i++) {
        if (!state[i]) {
            acts.push(i);
        }
    }
    return acts;
}

function apply(move, board, player) {
    board[move] = player;
}

function opponent(player) {
    return player === 'X' ? 'O' : 'X';
}

function max_value(state, alpha, beta, player) {
    if (is_terminal(state)) return utility(state, player);
    let value = Number.NEGATIVE_INFINITY;
    const acts = actions(state);
    for (let i = 0; i < acts.length; i++) {
        const action = acts[i];
        apply(action, state, player);
        value = Math.max(value, min_value(state, alpha, beta, opponent(player)));
        apply(action, state, null);
        alpha = Math.max(alpha, value);
        if (alpha >= beta) return value;
    }
    return value;
}

function min_value(state, alpha, beta, player) {
    if (is_terminal(state)) return utility(state, player);
    let value = Number.POSITIVE_INFINITY;
    const acts = actions(state);
    for (let i = 0; i < acts.length; i++) {
        const action = acts[i];
        apply(action, state, player);
        value = Math.min(value, max_value(state, alpha, beta, opponent(player)));
        apply(action, state, null);
        beta = Math.min(beta, value);
        if (alpha >= beta) return value;
    }
    return value;
}

function calculateFreeSquares(squares) {
    let count = 0;
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
            count++;
        }
    }
    return count;
}

function is_terminal(board) {
    return (calculateWinner(board) || !calculateFreeSquares(board));
}
