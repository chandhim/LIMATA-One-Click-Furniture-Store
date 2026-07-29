import torch
import os

os.makedirs('models/midas', exist_ok=True)
torch.hub.set_dir('models/midas')

print("Downloading MiDaS_small...")
model = torch.hub.load('intel-isl/MiDaS', 'MiDaS_small', trust_repo=True)
print("MiDaS downloaded.")
