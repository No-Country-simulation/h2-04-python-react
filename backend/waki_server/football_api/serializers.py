from rest_framework import serializers
from core.models import League, Match

class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = ['id_league', 'name', 'logo', 'country']

class MatchSerializer(serializers.ModelSerializer):
    league = LeagueSerializer(read_only=True) 

    
    class Meta:
        model = Match
        fields = ['id_fixture','league','date','home_team','home_team_logo','away_team','away_team_logo','home_team_goals','away_team_goals','match_status','home_odds','draw_odds','away_odds', 'winner']


