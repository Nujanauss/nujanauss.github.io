function comparisonViewedByParticipant = getComparison(params)
    trial = length(params.previousReward);
    comparisons = params.comparisons;
    frequency = params.comparisonFrequency;
    if mod(trial, frequency) == 0
        comparisonViewedByParticipant = sum(comparisons(trial-(frequency-1):trial));
    else
        comparisonViewedByParticipant = 0;
    end
end
