import random
from treys import Card, Evaluator

faces = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
suits = ['s', 'h', 'd', 'c']

def create_deck():
    return [face + suit for face in faces for suit in suits]

def deal(deck,cards):
    return [deck.pop() for i in range(cards)]

def get_Remaining_Deck(used_cards):
    full_deck = create_deck()
    return [card for card in full_deck if card not in used_cards]

def pretty_cards(cards):
    suit_symbols = {'s': '♠', 'h': '♥', 'd': '♦', 'c': '♣'}
    face_symbols = {'T': '10', 'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A'}
    
    pretty_cards = []
    for card in cards:
        face = card[0]
        suit = card[1]
        
        if face in face_symbols: 
            display_face = face_symbols[face]
        else:
            display_face = face
            
        display_suit = suit_symbols[suit]
        
        pretty_cards.append(f"{display_face}{display_suit}")
    
    return pretty_cards

def simulate_odds(hands, board, deck, num_sims = 1000):
    evaluator = Evaluator()
    wins = [0] * len(hands)
    ties = [0] * len(hands)
    cards_to_come = 5 - len(board)
    
    

    used_cards = []
    for hand in hands:
        used_cards.extend(hand)
    used_cards.extend(board)
    
    sim_deck = get_Remaining_Deck(used_cards)

    for i in range(num_sims):
        copy_deck = sim_deck.copy()
        random.shuffle(copy_deck)
        simulated_board = board + [copy_deck.pop() for i in range(cards_to_come)]

        hands_Treys = [[Card.new(card) for card in hand] for hand in hands]
        board_Treys = [Card.new(card) for card in simulated_board]

        scores = [evaluator.evaluate(board_Treys, hand) for hand in hands_Treys]

        best_score = min(scores)
        winners = []

        for i in range(len(scores)):
            if scores[i] == best_score:
                winners.append(i)
        
        for winner in winners:
            if len(winners) == 1:
                wins[winner] += 1
            else:
                ties[winner] += 1
    

    
    win_percentages = [(wins[i] / num_sims) * 100 for i in range(len(hands))]
    tie_percentages = [(ties[i] / num_sims) * 100 for i in range(len(hands))]
    
    return {
        'wins': wins,
        'ties': ties,
        'win_percentages': win_percentages,
        'tie_percentages': tie_percentages
    }

def validate_cards(hands, board):
    """Validate that all cards are valid and there are no duplicates"""
    all_cards = []
    
    # Check hands
    for i, hand in enumerate(hands):
        if len(hand) != 2:
            raise ValueError(f"Player {i+1} must have exactly 2 cards")
        for card in hand:
            # Convert to uppercase for validation
            card_upper = card.upper()
            if len(card_upper) != 2 or card_upper[0] not in faces or card_upper[1].lower() not in suits:
                raise ValueError(f"Invalid card '{card}' for Player {i+1}")
            if card_upper in all_cards:
                raise ValueError(f"Duplicate card '{card_upper}' found")
            all_cards.append(card_upper)
    
    # Check board
    for i, card in enumerate(board):
        # Convert to uppercase for validation
        card_upper = card.upper()
        if len(card_upper) != 2 or card_upper[0] not in faces or card_upper[1].lower() not in suits:
            raise ValueError(f"Invalid board card '{card}' at position {i+1}")
        if card_upper in all_cards:
            raise ValueError(f"Duplicate card '{card_upper}' found in board")
        all_cards.append(card_upper)
    
    # Check board length
    if len(board) > 5:
        raise ValueError("Board cannot have more than 5 cards")
    
    return True

def evaluate_hand_ranking(hand, board):
    """Evaluate hand ranking using treys library"""
    try:
        from treys import Evaluator, Card
        
        # Cards are already in correct format (uppercase face, lowercase suit)
        hand_cards = [Card.new(card) for card in hand]
        board_cards = [Card.new(card) for card in board]
        
        # For preflop (no board), we can't evaluate hand strength properly
        # Just return a basic description based on the hole cards
        if len(board_cards) == 0:
            # Simple preflop hand description
            face1, suit1 = hand[0][0], hand[0][1]
            face2, suit2 = hand[1][0], hand[1][1]
            
            # Check for pairs
            if face1 == face2:
                return f"Pair of {face1}s"
            
            # Check for suited
            if suit1 == suit2:
                return f"Suited {face1}{face2}"
            
            # Check for connectors
            face_values = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14}
            val1, val2 = face_values.get(face1, 0), face_values.get(face2, 0)
            if abs(val1 - val2) == 1:
                return f"Connector {face1}{face2}"
            
            return f"High Card {face1}{face2}"
        
        # For post-flop, use treys evaluation
        evaluator = Evaluator()
        score = evaluator.evaluate(board_cards, hand_cards)
        rank_class = evaluator.get_rank_class(score)
        rank_name = evaluator.class_to_string(rank_class)
        
        return rank_name
    except Exception as e:
        return f"Error: {str(e)}"

def calculate_odds_for_hands(hands, board, num_sims=1000):
    """Calculate odds for specific hands and board with validation"""
    try:
        # Validate input
        validate_cards(hands, board)
        
        # Convert to treys format (uppercase face, lowercase suit)
        hands = [[card[0].upper() + card[1].lower() for card in hand] for hand in hands]
        board = [card[0].upper() + card[1].lower() for card in board]
        
        deck = create_deck()
        odds_result = simulate_odds(hands, board, deck, num_sims)
        
        # Add hand rankings (hands and board are already in correct format)
        hand_rankings = []
        for hand in hands:
            hand_rankings.append(evaluate_hand_ranking(hand, board))
        
        odds_result['hand_rankings'] = hand_rankings
        return odds_result
        
    except Exception as e:
        # Return error in the same format as successful results
        return {
            'error': str(e),
            'wins': [0] * len(hands),
            'ties': [0] * len(hands),
            'win_percentages': [0.0] * len(hands),
            'tie_percentages': [0.0] * len(hands),
            'hand_rankings': ['Error'] * len(hands)
        }

def get_odds_json(hands, board, num_sims=1000):
    """Get odds as JSON string for frontend"""
    import json
    odds = calculate_odds_for_hands(hands, board, num_sims)
    return json.dumps(odds)

def calculate_odds_simple(hands, board, num_sims=1000):
    """Simple function that frontend can call directly"""
    return calculate_odds_for_hands(hands, board, num_sims)


if __name__ == "__main__":
    import sys
    import json
    
    # Check if called with JSON input from frontend
    try:
        # Try to read JSON from stdin first
        import select
        if select.select([sys.stdin], [], [], 0.0)[0]:
            data = json.load(sys.stdin)
            hands = data['hands']
            board = data['board']
            num_sims = data.get('num_sims', 1000)
            
            # Calculate odds
            odds = calculate_odds_for_hands(hands, board, num_sims)
            
            # Output JSON result
            print(json.dumps(odds))
            sys.exit(0)
    except:
        pass
    
    # Check if called with arguments (from frontend)
    if len(sys.argv) > 1:
        try:
            # Parse JSON input from frontend
            data = json.loads(sys.argv[1])
            hands = data['hands']
            board = data['board']
            num_sims = data.get('num_sims', 1000)
            
            # Calculate odds
            odds = calculate_odds_for_hands(hands, board, num_sims)
            
            # Output JSON result
            print(json.dumps(odds))
            sys.exit(0)
        except Exception as e:
            print(json.dumps({'error': str(e)}))
            sys.exit(1)
    
    # Original interactive mode (only if no JSON input)
    deck = create_deck()
    random.shuffle(deck)

    try:
        num_players = int(input("How many players? "))
    except EOFError:
        # No input available, exit gracefully
        sys.exit(0)
    
    # Guard clause for too many players
    if num_players > 22:
        print("Error: Maximum 22 players allowed (not enough cards in deck)")
        exit()
    
    hands = []
    for i in range(num_players):
        hands.append(deal(deck, 2))
    
    # Preflop simulation
    odds = simulate_odds(hands, [], deck, 1000)

    print("Preflop Odds:")
    for i, hand in enumerate(hands):
        print(f"Player {i+1} hand: {pretty_cards(hand)}")
        print(f"  Win percentage: {odds['win_percentages'][i]:.2f}%")
        print(f"  Chop percentage: {odds['tie_percentages'][i]:.2f}%")
        print()

    # Deal flop
    flop = deal(deck, 3)
    print(f'Flop: {pretty_cards(flop)}')
    
    # Post-flop simulation
    odds = simulate_odds(hands, flop, deck, 1000)
    print("Post-flop Odds:")
    evaluator = Evaluator()
    hand_rankings = []
    
    for i, hand in enumerate(hands):
        hands_Treys = [Card.new(card) for card in hand]
        board_Treys = [Card.new(card) for card in flop]
        score = evaluator.evaluate(board_Treys, hands_Treys)
        rank_class = evaluator.get_rank_class(score)
        rank_name = evaluator.class_to_string(rank_class)
        
        hand_rankings.append((i, score, rank_name))
    
    hand_rankings.sort(key=lambda x: x[1])
    
    for i, hand in enumerate(hands):
        player_rank = next(rank for rank, (player_idx, score, rank_name) in enumerate(hand_rankings) if player_idx == i)
        rank_name = hand_rankings[player_rank][2]
        
        print(f"Player {i+1} hand: {pretty_cards(hand)}")
        print(f"  Win percentage: {odds['win_percentages'][i]:.2f}%")
        print(f"  Chop percentage: {odds['tie_percentages'][i]:.2f}%")
        print(f"  Hand: {rank_name}")
        print()

    # Deal turn
    turn = deal(deck, 1)
    board_with_turn = flop + turn
    print(f'Turn: {pretty_cards(turn)}')
    print(f'Board: {pretty_cards(board_with_turn)}')
    
    # Post-turn simulation
    odds = simulate_odds(hands, board_with_turn, deck, 1000)
    print("Post-turn Odds:")
    hand_rankings = []
    
    for i, hand in enumerate(hands):
        hands_Treys = [Card.new(card) for card in hand]
        board_Treys = [Card.new(card) for card in board_with_turn]
        score = evaluator.evaluate(board_Treys, hands_Treys)
        rank_class = evaluator.get_rank_class(score)
        rank_name = evaluator.class_to_string(rank_class)
        
        hand_rankings.append((i, score, rank_name))
    
    hand_rankings.sort(key=lambda x: x[1])
    
    for i, hand in enumerate(hands):
        player_rank = next(rank for rank, (player_idx, score, rank_name) in enumerate(hand_rankings) if player_idx == i)
        rank_name = hand_rankings[player_rank][2]
        
        print(f"Player {i+1} hand: {pretty_cards(hand)}")
        print(f"  Win percentage: {odds['win_percentages'][i]:.2f}%")
        print(f"  Chop percentage: {odds['tie_percentages'][i]:.2f}%")
        print(f"  Hand: {rank_name}")
        print()

    # Deal river
    river = deal(deck, 1)
    final_board = board_with_turn + river
    print(f'River: {pretty_cards(river)}')
    print(f'Final Board: {pretty_cards(final_board)}')
    
    # Post-river simulation
    odds = simulate_odds(hands, final_board, deck, 1000)
    print("Post-river Odds:")
    hand_rankings = []
    
    for i, hand in enumerate(hands):
        hands_Treys = [Card.new(card) for card in hand]
        board_Treys = [Card.new(card) for card in final_board]
        score = evaluator.evaluate(board_Treys, hands_Treys)
        rank_class = evaluator.get_rank_class(score)
        rank_name = evaluator.class_to_string(rank_class)
        
        hand_rankings.append((i, score, rank_name))
    
    hand_rankings.sort(key=lambda x: x[1])
    
    for i, hand in enumerate(hands):
        player_rank = next(rank for rank, (player_idx, score, rank_name) in enumerate(hand_rankings) if player_idx == i)
        rank_name = hand_rankings[player_rank][2]
        print(f"Player {i+1} hand: {pretty_cards(hand)}")
        print(f"  Win percentage: {odds['win_percentages'][i]:.2f}%")
        print(f"  Chop percentage: {odds['tie_percentages'][i]:.2f}%")
        print(f"  Hand: {rank_name}")
        print()
    










