import pandas as pd
import random


funny_names = [
    "FluffyUnicorn", "DizzyPlatypus", "WackyMuffin", "SillyPickle", "CheekyBanana",
    "MightyPotato", "Gigglesaurus", "BouncyPanda", "JollyPickle", "CrazyAvocado",
    "ZanyNoodle", "KookyKoala", "WobblyPenguin", "NaughtyMango", "GigglyPineapple",
    "ClumsyJellyfish", "SoggyWaffle", "CharmingCucumber", "GrumpyTomato", "SneezyDragon",
    "HappyTaco", "MightyGiraffe", "SleepyGiraffe", "SquishyPumpkin", "BubblyToad",
    "QuirkyBeetle", "SpikyMango", "FluffyToothbrush", "WeirdPenguin", "SoggyPotato",
    "CheekyMango", "ZippyZebra", "SillySquid", "BouncyElephant", "WackyOctopus"
]


special_chars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+']

file_path = 'userData.xlsx'
df = pd.read_excel(file_path)

if len(df['name']) == 34:

    df['password'] = [funny_names[i] + random.choice(special_chars) for i in range(34)]

    output_file = 'E:\\leaderboards\\data\\userData.xlsx'
    df.to_excel(output_file, index=False)


    print(df.head())
else:
    print("The number of names in the dataset is not 34. Please check the data.")
