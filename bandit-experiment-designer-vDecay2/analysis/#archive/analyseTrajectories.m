id = 'DX4jx';
data = getAllData(id);

algo = 'random';
resultsFilename = getResultsFilename(algo);
dataForAlgo = data.(resultsFilename);

[decisions,rewards,comparisons,perseverations,upwardComparisons,diffRewardComparisons] = getDataIntoColArrays(dataForAlgo);

decisions = decisions + 1; % index by 1
shiftedRewards = circshift(rewards, 1); % care about the previous reward affecting this decision
shiftedRewards(1) = 0;

[logitCoef,p] = pTestBinomial(shiftedRewards,perseverations);

logitFit = glmval(logitCoef,perseverations,'logit');
plot(shiftedRewards,perseverations,'bs', perseverations, logitFit,'r-');
xlabel('Previous Reward'); ylabel('Perseveration');


function resultsFilename = getResultsFilename(algo)
    switch algo
        case 'random'
            resultsFilename = 'randomSimulationResults';
            return
        case 'greedy'
            resultsFilename = 'greedySimulationResults';
            return
        case 'threshold'
            resultsFilename = 'thresholdSimulationResults';
            return
        case 'softmax'
            resultsFilename = 'softmaxSimulationResults';
            return
    end
end


function data = getAllData(id)
    allFiles = dir('*.json');
    data = struct();
    for f = 1:length(allFiles)
        if ~(endsWith(allFiles(f).name,['_',id,'.json']))
            continue;
        end

        filename = allFiles(f).name;
        fid = fopen(filename, 'r');
        raw = fread(fid, inf, '*char')';
        fclose(fid);

        filenameSansId = split(filename,'_');
        data.(filenameSansId{1}) = jsondecode(raw);
    end
end


function [allDecisions,allRewards,allComparisons,allPerseverations,allUpwardComparisons,allDiffRewardComparisons] = getDataIntoColArrays(dataForAlgo)
    allDecisions = [];
    allRewards = [];
    allComparisons = [];
    allPerseverations = [];
    allUpwardComparisons = [];
    allDiffRewardComparisons = [];
    for i = 1:length(dataForAlgo)
        randomSimulationI = struct2cell(dataForAlgo{i, 1}); 
    
        decisions = arrayfun(@(x) x.decision, randomSimulationI{1});
        allDecisions = cat(1, allDecisions, decisions); % dim 1 means vertically
    
        rewards = arrayfun(@(x) x.reward, randomSimulationI{1});
        allRewards = cat(1, allRewards, rewards);
    
        comparisons = arrayfun(@(x) ifelse(isempty(x.comparison), NaN, x.comparison), randomSimulationI{1});
        allComparisons = cat(1, allComparisons, comparisons);
    
        perseverations = arrayfun(@(x) x.perseveration, randomSimulationI{1});
        allPerseverations = cat(1, allPerseverations, perseverations);
    
        upwardComparisons = arrayfun(@(x) x.upwardComparison, randomSimulationI{1});
        allUpwardComparisons = cat(1, allUpwardComparisons, upwardComparisons);
    
        diffRewardComparisons = arrayfun(@(x) ifelse(isempty(x.diffRewardComparison), NaN, x.diffRewardComparison), randomSimulationI{1});
        allDiffRewardComparisons = cat(1, allDiffRewardComparisons, diffRewardComparisons);
    end

    % Helper function for inline if-else
    function out = ifelse(cond, trueVal, falseVal)
        if cond
            out = trueVal;
        else
            out = falseVal;
        end
    end
end


% https://www.mathworks.com/help/stats/glmfit.html
function [logitCoef,p] = pTestBinomial(X,y)
    [logitCoef,dev] = glmfit(X,y,'binomial','logit');
    [~,dev_noconstant] = glmfit(ones(length(y),1),y,'binomial','Constant','off');
    D = dev_noconstant - dev;
    p = 1 - chi2cdf(D,2);
end
