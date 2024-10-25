def calculate_club_token_burn(player):
    total_burn = 0
    for club in player.teams.all():
        club_ranking = club.ranking
        confederation_factor = get_confederation_factor(club.confederation)
        
        ranking_percentages = {
            1: 10, 2: 9.67, 3: 9.33, 4: 9, 5: 8.67, 6: 8.33, 7: 8,
            8: 7.67, 9: 7.33, 10: 7, 11: 6.67, 12: 6.33, 13: 6, 14: 5.67,
            15: 5.33, 16: 5, 17: 4.67, 18: 4.33, 19: 4, 20: 3.67, 21: 3.33,
            22: 3, 23: 2.67, 24: 2.33, 25: 2, 26: 1.67, 27: 1.33, 28: 1,
            29: 0.67, 30: 0.33
        }

        burn_percentage = ranking_percentages.get(club_ranking, 0)
        total_burn += burn_percentage * (1 + confederation_factor)

    return total_burn

def get_confederation_factor(confederation):
    confederation_factors = {
        'UEFA': 0.50,
        'CONMEBOL': 0.33,
        'CONCACAF': 0.15,
        'AFC': 0.15,
        'CAF': 0.10,
        'OFC': 0.0,
    }
    return confederation_factors.get(confederation, 0)

def calculate_match_token_burn(player):
    G = player.matches_played / player.total_club_matches
    club_burn = calculate_club_token_burn(player)
    return G * club_burn

def calculate_rating_token_burn(player):
    G = player.matches_played / player.total_club_matches
    total_rating_burn = 0
    for club in player.teams.all():
        A = get_league_factor(club)
        total_rating_burn += player.rating * G * (1 + A)
    return total_rating_burn

def get_league_factor(club):
    league_factors = {
        'Premier League': 0.20,
        'La Liga': 0.18,
        'Serie A': 0.16,
        'Bundesliga': 0.14,
        'Ligue 1': 0.12,
        'Primeira Liga': 0.10,
        'Eredivisie': 0.08,
        'Brasileirão': 0.06,
        'Superliga Argentina': 0.04,
        'MLS': 0.02,
    }
    return league_factors.get(club.name, 0)

def calculate_goals_token_burn(player):
    return player.goals * 0.5

def calculate_assists_token_burn(player):
    return player.assists * 0.3

def calculate_national_team_token_burn(player):
    G = player.national_team_matches / player.total_club_matches
    ranking_factor = get_national_team_ranking_factor(player.national_team_ranking)
    burn_percentage = 5 + (5 * G)
    return burn_percentage * (1 + ranking_factor)

def get_national_team_ranking_factor(ranking):
    ranking_factors = {
        1: 0.20, 2: 0.19, 3: 0.18, 4: 0.17, 5: 0.16, 6: 0.15,
        7: 0.14, 8: 0.13, 9: 0.12, 10: 0.11, 11: 0.10, 12: 0.09,
        13: 0.08, 14: 0.07, 15: 0.06, 16: 0.05, 17: 0.04, 18: 0.03,
        19: 0.02, 20: 0.01
    }
    return ranking_factors.get(ranking, 0)

def calculate_trophy_token_burn(player):
    return 15  # Aquí se puede añadir lógica adicional para los trofeos

def calculate_total_token_burn(player):
    club_burn = calculate_club_token_burn(player)
    match_burn = calculate_match_token_burn(player)
    rating_burn = calculate_rating_token_burn(player)
    goals_burn = calculate_goals_token_burn(player)
    assists_burn = calculate_assists_token_burn(player)
    national_team_burn = calculate_national_team_token_burn(player)
    trophy_burn = calculate_trophy_token_burn(player)

    total_burn = (club_burn + match_burn + rating_burn +
                goals_burn + assists_burn + national_team_burn +
                trophy_burn)
    return total_burn