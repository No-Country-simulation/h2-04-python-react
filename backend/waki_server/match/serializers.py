from rest_framework import serializers

from core.models import Prediction, PredictionDetail, Match


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'



class PredictionDetailSerializer(serializers.ModelSerializer):
    match = serializers.SlugRelatedField(slug_field='id_fixture', queryset=Match.objects.all())
    
    class Meta:
        model = PredictionDetail
        fields = ['id','match', 'prediction_text', 'selected_odds', 'potential_gain','status']

class PredictionDetailSerializerGet(serializers.ModelSerializer):
    match = MatchSerializer()
    
    class Meta:
        model = PredictionDetail
        fields = ['id','match', 'prediction_text', 'selected_odds', 'potential_gain','status']

class PredictionSerializer(serializers.ModelSerializer):
    details = PredictionDetailSerializer(many=True, required=False)

    class Meta:
        model = Prediction
        fields = ['user','bet_type', 'created_at', 'details', 'potential_gain','status']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        prediction = Prediction.objects.create(**validated_data)

        for detail_data in details_data:
            PredictionDetail.objects.create(prediction=prediction, **detail_data)

        return prediction