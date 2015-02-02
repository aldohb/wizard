wizardApp.controller('WizardController', ['$scope', '$window',
    function ($scope, $window) {
        // We start with an already created user account
        $scope.user = {
            username: 'jdoe45',
            firstName: 'John',
            lastName: 'Doe',
            email: 'jdoe45@hotmail.com',
            accountType: 'Unconfirmed',
            selectedInterests: []
        };

        // A list of interests from which to choose
        $scope.interests = ['Arts/Music', 'Reading', 'Outdoor Sports', 'Traveling', 'Languages',
        'Science/Technology', 'Yoga/Spiritual', 'Religion', 'Movies/TV', 'Nothing/Nihilism'];

        $scope.hasSelectedInterests = function() {
            return $scope.user.selectedInterests.length > 0;
        };

        // Watch the list of selected interests to update the interest count and reveal
        // the features available after selecting 4 or more
        $scope.$watchCollection('user.selectedInterests', function (newArray, oldArray) {
            $scope.wizard.interestCount = newArray.length;
        });

        $scope.$watch('wizard.interestCount', function (newCount, oldCount) {
            if (newCount >= 4) {
                $scope.user.accountType = 'Plus';
            } else if ($scope.wizard.step === 'three') {
                $scope.user.accountType = 'Standard';
            }
        });

        // Select/Unselect an interest
        $scope.toggleInterest = function(interest) {
            var index = $scope.user.selectedInterests.indexOf(interest);

            if (index > -1) {
                $scope.user.selectedInterests.splice(index, 1);
            } else {
                $scope.user.selectedInterests.push(interest);
            }
        };

        // Let's work on a copy of the data so we can undo
        $scope.userDirty = angular.copy($scope.user);

        // This keeps track of which step the user is seeing
        $scope.wizard = {
            step: "one",
            interestCount: 0
        };

        // Confirm a light account, from step one
        $scope.confirmLight = function() {
            $scope.userDirty.accountType = 'Light';
            $scope.wizard.step = 'finish';
            $scope.user = $scope.userDirty;
        };

        // Handle the upgrade to a standard account
        $scope.createStandard = function (opt) {
            switch (opt.fromStep) {
                // The user comes from step one, copy user data
                case 'one': 
                    $scope.userDirty.accountType = 'Standard';
                    $scope.user = $scope.userDirty;
                    $scope.wizard.step = 'two';
                    break;
                // The user comes from the last step. Data has already been copied
                case 'finish':
                    $scope.user.accountType = 'Standard';
                    $scope.wizard.step = 'two';
            }
        };

        // Set the state for a Premium account
        $scope.createPremium = function() {
            $scope.user.accountType = "Premium";
            $scope.wizard.step = 'finish';
        };

        // Undo an upgrade from Light to Standard (go back to Light and finish)
        $scope.undoStandard = function () {
            $scope.user.accountType = 'Light'
            $scope.wizard.step = 'finish';
        };

        // The user wants to upgrade to a Plus account, so go to step three
        $scope.createPlus = function () {
            $scope.wizard.step = 'three';
        };

        $scope.isUnconfirmed = function() {
            return $scope.user.accountType === 'Unconfirmed';
        };

        $scope.resetData = function() {
            if ($window.confirm('Undo changes and reset your original data?')) {
                $scope.userDirty = angular.copy($scope.user);
            }
        }

        // Polyfill for Array.prototype.indexOf, lifted off of MDN

        // Production steps of ECMA-262, Edition 5, 15.4.4.14
        // Reference: http://es5.github.io/#x15.4.4.14
        if (!Array.prototype.indexOf) {
          Array.prototype.indexOf = function(searchElement, fromIndex) {

            var k;

            // 1. Let O be the result of calling ToObject passing
            //    the this value as the argument.
            if (this == null) {
              throw new TypeError('"this" is null or not defined');
            }

            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get
            //    internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If len is 0, return -1.
            if (len === 0) {
              return -1;
            }

            // 5. If argument fromIndex was passed let n be
            //    ToInteger(fromIndex); else let n be 0.
            var n = +fromIndex || 0;

            if (Math.abs(n) === Infinity) {
              n = 0;
            }

            // 6. If n >= len, return -1.
            if (n >= len) {
              return -1;
            }

            // 7. If n >= 0, then Let k be n.
            // 8. Else, n<0, Let k be len - abs(n).
            //    If k is less than 0, then let k be 0.
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            // 9. Repeat, while k < len
            while (k < len) {
              // a. Let Pk be ToString(k).
              //   This is implicit for LHS operands of the in operator
              // b. Let kPresent be the result of calling the
              //    HasProperty internal method of O with argument Pk.
              //   This step can be combined with c
              // c. If kPresent is true, then
              //    i.  Let elementK be the result of calling the Get
              //        internal method of O with the argument ToString(k).
              //   ii.  Let same be the result of applying the
              //        Strict Equality Comparison Algorithm to
              //        searchElement and elementK.
              //  iii.  If same is true, return k.
              if (k in O && O[k] === searchElement) {
                return k;
              }
              k++;
            }
            return -1;
          };
        }
    }
]);