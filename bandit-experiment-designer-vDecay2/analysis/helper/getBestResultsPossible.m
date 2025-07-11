function bestPossbileResult = getBestResultsPossible(trajectoryOption)
    bestPossbileResult = zeros(length(trajectoryOption),1);
    for i = 1:length(trajectoryOption)
        bestPossbileResult(i) = max(trajectoryOption(i,:));
    end
end