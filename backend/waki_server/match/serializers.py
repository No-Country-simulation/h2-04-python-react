from rest_framework import serializers

from core.models import Prediction, PredictionDetail, Match


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match  # Reemplaza 'Match' con el nombre exacto de tu modelo de partido
        fields = ['id_fixture', 'league ', 'date', 'home_team', 'score_a', 'score_b']  # Ajusta los campos según tu modelo



class PredictionDetailSerializer(serializers.ModelSerializer):
    match = serializers.SlugRelatedField(slug_field='id_fixture', queryset=Match.objects.all())
    
    class Meta:
        model = PredictionDetail
        fields = ['id','match', 'prediction_text', 'selected_odds', 'potential_gain']


class PredictionSerializer(serializers.ModelSerializer):
    details = PredictionDetailSerializer(many=True, required=False)

    class Meta:
        model = Prediction
        fields = ['user','bet_type', 'created_at', 'details']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        prediction = Prediction.objects.create(**validated_data)

        for detail_data in details_data:
            PredictionDetail.objects.create(prediction=prediction, **detail_data)

        return prediction