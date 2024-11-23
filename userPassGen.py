import pandas as pd
import random

# List of 34 funny names
funny_names = [
    "FluffyUnicorn", "DizzyPlatypus", "WackyMuffin", "SillyPickle", "CheekyBanana",
    "MightyPotato", "Gigglesaurus", "BouncyPanda", "JollyPickle", "CrazyAvocado",
    "ZanyNoodle", "KookyKoala", "WobblyPenguin", "NaughtyMango", "GigglyPineapple",
    "ClumsyJellyfish", "SoggyWaffle", "CharmingCucumber", "GrumpyTomato", "SneezyDragon",
    "HappyTaco", "MightyGiraffe", "SleepyGiraffe", "SquishyPumpkin", "BubblyToad",
    "QuirkyBeetle", "SpikyMango", "FluffyToothbrush", "WeirdPenguin", "SoggyPotato",
    "CheekyMango", "ZippyZebra", "SillySquid", "BouncyElephant", "WackyOctopus"
]

# Special characters to append
special_chars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+']

# Load your data (assuming the file is in Excel format)
file_path = 'userData.xlsx'  # Update this path to your actual file location
df = pd.read_excel(file_path)

# Ensure there are exactly 34 names
if len(df['name']) == 34:
    # Add the funny password to the dataframe
    df['password'] = [funny_names[i] + random.choice(special_chars) for i in range(34)]

    # Save the updated DataFrame to a new file
    output_file = 'E:\\leaderboards\\data\\userData.xlsx'  # Path to save the updated file
    df.to_excel(output_file, index=False)

    # Optionally print the first few rows to verify
    print(df.head())
else:
    print("The number of names in the dataset is not 34. Please check the data.")
