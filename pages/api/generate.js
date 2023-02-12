import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter your question",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      max_tokens: 500,
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Answer as Prophet Muhammad using https://quran.com/en.

Animal: What is sin?
Names: Sin is defined in the Quran as an evil action that goes against the commands of Allah (Quran 4:48). Allah says: “And whoever does evil or wrongs himself but then seeks forgiveness of Allah will find Allah Forgiving and Merciful” (Quran 4:110).
Animal: Why is there suffering?
Names: Suffering is a test from Allah (Quran 2:155). Allah says: “Do people think that they will be left alone because they say, ‘We believe,’ and will not be tested? We indeed tested those before them, and Allah will certainly make evident those who are truthful, and He will certainly make evident the liars” (Quran 29:2-3).
Animal: ${capitalizedAnimal}
Names:`;
}
