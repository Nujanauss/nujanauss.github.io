function params= getParameterSampleForModel(version,params)
    kalmanParams = {'means',zeros(4,1),'variances',zeros(4,1),'variance_o',4.0^2,'variance_d',2.8^2,'lamda',0.9836,'theta',0.5};
    socialParams = {'trialToBeginComparison',51,'trialToEndComparison',101,'comparisonFrequency',5,'upwardComparisonPercentage',0.8};
    switch version
        case 'random'
        case 'randomBias'
            params.bias = unifrnd(0,1);
            params.biasedArm = randi(4);
        case 'winStay'
            params.repeatThreshold = unifrnd(0,1);
            params.epsilon = unifrnd(0,0.25);
        case 'perseveration'
            params.cValues = [0;0;0;0];
            params.alphaC = unifrnd(0,1);
            params.betaC = exprnd(5);
        case 'greedy'
            params.epsilon = unifrnd(0,0.25);
            params = addOneStructToAnother(params,kalmanParams);
        case 'softmax'
            params.beta = exprnd(5);
            params = addOneStructToAnother(params,kalmanParams);
        case 'directed'
            params.beta = exprnd(5);
            params.omega = unifrnd(0,1);
            params = addOneStructToAnother(params,kalmanParams);
        case 'perseverationSoft'
            params.cValues = [0;0;0;0];
            params.alphaC = unifrnd(0,1);
            params.betaC = exprnd(5);
            params.beta = exprnd(5);
            params = addOneStructToAnother(params,kalmanParams);
        case 'socialWinStay'
            params.epsilon = unifrnd(0,0.25);
            params.repeatThreshold = unifrnd(0,1);
            params.tau = unifrnd(0,1);
            params = addOneStructToAnother(params,socialParams);
        case 'socialEpsilonGreedy'
            params.epsilonInt = unifrnd(0,0.25);
            params.epsilonSlop = unifrnd(-1,1);
            params = addOneStructToAnother(params,kalmanParams);
            params = addOneStructToAnother(params,socialParams);
        case 'socialSoftmax'
            params.betaInt = exprnd(5);
            params.betaSlop = unifrnd(-1,1);
            params = addOneStructToAnother(params,kalmanParams);
            params = addOneStructToAnother(params,socialParams);
        case 'socialDirectedSoftmax'
            params.beta = exprnd(5);
            params.omegaInt = unifrnd(0,1);
            params.omegaSlop = unifrnd(-1,1);
            params = addOneStructToAnother(params,kalmanParams);
            params = addOneStructToAnother(params,socialParams);
        case 'socialSkillWinStay'
            params.skill = 0; % initial
            params.alphaSkill = unifrnd(0,1);
            params.tau = unifrnd(0,1);
            params.epsilon = unifrnd(0,0.25);
            params.repeatThreshold = unifrnd(0,1);
            params = addOneStructToAnother(params,socialParams);
        case 'varianceUpdatingSoftmax'
            params.noUpdates = 1; % initial
            params.meanDiff = 0; % initial
            params.diffVariance = 0; % initial
            params.lamdaC = unifrnd(0,100);
            params.beta = exprnd(5);
            params = addOneStructToAnother(params,kalmanParams);
            params = addOneStructToAnother(params,socialParams);
    end
    params.previousSelection = [];
    params.previousReward = [];
end

function receiving = addOneStructToAnother(receiving,sending)
    for i = 1:2:length(sending)
        field = sending{i};
        value = sending{i+1};
        receiving.(field) = value;
    end
end