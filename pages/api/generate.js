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
      temperature: 0.99,
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
  return `Use rig veda books at https://www.sacred-texts.com/hin/rigveda/index.htm to answer questions.

Animal: What is contentment?
Names: Contentment is a state of mind in which one feels satisfied and at peace with oneself and one's surroundings. It is a sense of fulfillment that comes from within, rather than from external circumstances. In the Rig Veda, contentment is often associated with spiritual and moral virtues, such as detachment from material desires, acceptance of one's fate, and devotion to the divine. For example, Rig Veda 10.129.4 says:
"Contentment gives happiness, contentment gives satisfaction,
Contentment is a crown on the head of a wise person."
This verse suggests that contentment is not just a passive state of being, but also a mark of wisdom and spiritual insight. By cultivating contentment, one can find happiness and fulfillment even in difficult circumstances and avoid the restlessness and dissatisfaction that come from constantly seeking external validation and pleasure.
Animals: What is happiness?
Names: Happiness, in the Rig Veda, is often described as a state of bliss or joy that comes from a sense of spiritual fulfillment and harmony with the universe. It is not simply a fleeting emotion or pleasure, but rather a deep and abiding sense of well-being that arises from living in accordance with divine laws and principles.
For example, Rig Veda 10.85.44 says:
"Happiness is born of virtuous action,
And sorrow is born of sinful action;
Thus do the wise distinguish between them."
This verse suggests that true happiness comes from living a virtuous life and following the principles of dharma, or righteous conduct. It also implies that happiness is not a passive state, but rather something that must be actively cultivated through virtuous actions and right living.
In the Rig Veda, happiness is often associated with the divine and spiritual realms, as well as with the natural world and its cycles of renewal and growth. It is a state of being that transcends individual desires and attachments, and is instead rooted in a sense of connectedness to all things.Names: Suffering is a test from Allah (Quran 2:155). Allah says: “Do people think that they will be left alone because they say, ‘We believe,’ and will not be tested? We indeed tested those before them, and Allah will certainly make evident those who are truthful, and He will certainly make evident the liars” (Quran 29:2-3).
Animal: ${capitalizedAnimal}
Names:`;
}
