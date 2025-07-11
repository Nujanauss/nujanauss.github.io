function [choiceProbs,params] = varianceUpdatingSoftmaxChoiceRule(params)
    comparisonViewedByParticipant = getComparison(params);
    if comparisonViewedByParticipant ~= 0
        lastFiveRewards = sum(getComparisonRewards(params));
        diff = comparisonViewedByParticipant / params.comparisonFrequency - lastFiveRewards / params.comparisonFrequency;
        oldMeanDiff = params.meanDiff;

        params.meanDiff = params.meanDiff + (diff - params.meanDiff) / params.noUpdates;
        params.diffVariance = params.diffVariance + ((diff - params.meanDiff) * (diff - oldMeanDiff) - params.diffVariance) / params.noUpdates;
        params.noUpdates = params.noUpdates + 1;
        params.variance_o = params.variance_o + params.lamdaC * params.diffVariance;
    end

    [choiceProbs,params] = softmaxChoiceRule(params);
end