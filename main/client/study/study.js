var studyApp = angular.module('study', []);

studyApp.controller('studyCtrl', function ($scope, getFileList, $location, viewsFactory) {

  //show that textarea:
  $('.scrachPaper').removeClass('noShow');

  $scope.gData = getFileList.dataObj;
  //click a button then show, click again then next card
  //if state = 0 then you are seeing cards, if 1 then you are seeing answer
  $scope.state = 0;

  //go through each card one by one, they have already been randomized.
  $scope.lastCardIndex = ($scope.gData.shuffledStack || []).length;

  var renderCard = function(card){
    $('.question').empty();
    $('.answer').empty();

    var converter = new showdown.Converter();
    $('.question').html(converter.makeHtml(card.question));
    $('.answer').html(converter.makeHtml(card.answer));
  };
  
  $scope.showGoToEdit = false;
  $scope.showOneCard = function(){
    var stack = $scope.gData.shuffledStack;
    if (stack.length === 0){
      $scope.progress--;
      $scope.curCard = {
        question : 'You Are Done! This Is The End (╯°□°）╯︵ ┻━┻) ',
        answer : 'You Are Done! This Is The End (╯°□°）╯︵ ┻━┻) '
      };
      renderCard($scope.curCard);
      if ($scope.showGoToEdit){
        viewsFactory.showPSA('save you changes!');
        $scope.gData.crossViewMessage = true;
        $location.path('/edit');
        // $scope.$apply(); somehow this in not needed????
      }
    } else {
      $scope.curCard = stack.pop();
      $scope.state = 0;
      $scope.progress = stack.length;
      viewsFactory.resetPSA(); 
      renderCard($scope.curCard);
      $scope.editing = false;
      $('.scrachPaper').focus();
    }
  };

  //immediately show one card when this view is rendered
  if ($scope.gData.shuffledStack){
    $scope.showOneCard();
  }

  $scope.restudy = function(){
    var curStackIndex = $scope.gData.curStackIndex;
    $scope.gData.shuffledStack = getFileList.shuffle($scope.gData.allStacks[curStackIndex]);
    $scope.showOneCard(); 
  };

  $scope.showAnswer = function(){
    $scope.state = !$scope.state;
  };

  $scope.forgotCard = function () {
    var canPerform = viewsFactory.showPSA('added card');
    if (!canPerform){return;}

    $scope.showGoToEdit = true;

    var lastStackIndex = $scope.gData.allStacks.length-1;
    var lastStack = $scope.gData.allStacks[lastStackIndex];
    if (/update/.test(lastStack.stackName)){
      lastStack.push($scope.curCard);
    } else {
      var newStack = [];
      newStack.push($scope.curCard);
      newStack.stackName = '#----update----';
      $scope.gData.allStacks.push(newStack);
    }
  };

  $scope.deleteCard = function () {
    //splice current card by index from the allStack
    var canPerform = viewsFactory.showPSA('deleted card');
    if (!canPerform){return;}

    $scope.showGoToEdit = true;
    var oldMeg = $scope.curCard.question;
    var divLine = "---------------------------------";
    $scope.curCard.question = '###'+divLine+'you sure you wanna deleted this?'+divLine+'\n'+ oldMeg; 

    // var targetIndex = $scope.curCard.cardID;
    // var stackIndex = $scope.gData.curStackIndex;
    // var curStack = $scope.gData.allStacks[stackIndex];

    // curStack.forEach(function(QandAObj, QnAIndex) {
    //   if (QandAObj.cardID === targetIndex){
    //     curStack.splice(QnAIndex, 1);
    //   }
    // });

    // if (curStack.length === 0 ){
    //   $scope.gData.allStacks.forEach(function (stack, index) {
    //     if (stack.stackName === curStack.stackName){
    //       $scope.gData.allStacks.splice(index, 1);
    //     }
    //   });
    // }
  };

  $scope.editing = false;
  $scope.editCurCard = function(){
    if (!$scope.editing){
      $('.question').html('<textarea>' + $scope.curCard.question + '</textarea>');
      $('.answer').html('<textarea>' + $scope.curCard.answer + '</textarea>');
      $scope.editing = true;
      $scope.showGoToEdit = true;
    } else {
      $scope.curCard.question = $('.question textarea').val();
      $scope.curCard.answer = $('.answer textarea').val();
      renderCard($scope.curCard);
    }
  };

  Mousetrap.bind('enter', function () {
    angular.element('.nextQuestion').trigger('click');
  });

  Mousetrap.bind('space', function () {
    angular.element('.showAnswer').trigger('click');
  }); 

  Mousetrap.bind('a', function () {
    angular.element('.forgotCard').trigger('click');
  }); 

});
