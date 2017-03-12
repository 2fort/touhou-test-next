export default function generateTest(characters, maxSteps) {
  const randomNumber = scopeLength => Math.floor(Math.random() * scopeLength);
  const steps = [];

  for (let st = 1; st <= maxSteps; st++) {
    let rndCharacterPosition = randomNumber(characters.length);
    const rndCharacter = characters[rndCharacterPosition];

    const oneStep = {
      step: st,
      image: rndCharacter.image,
      passed: false,
      buttons: [rndCharacter],
      rightAnswer: rndCharacter.name,
      givenAnswer: '',
    };

    characters.splice(rndCharacterPosition, 1);
    const variantsArray = characters.slice();

    for (let i = 1; i <= 4; i++) {
      rndCharacterPosition = randomNumber(variantsArray.length);
      oneStep.buttons[i] = variantsArray[rndCharacterPosition];
      variantsArray.splice(rndCharacterPosition, 1);
    }

    for (let i = oneStep.buttons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = oneStep.buttons[i];
      oneStep.buttons[i] = oneStep.buttons[j];
      oneStep.buttons[j] = temp;
    }

    steps.push(oneStep);
  }

  return steps;
}
