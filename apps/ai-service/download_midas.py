import torch

if __name__ == "__main__":
    print("Pre-downloading MiDaS model to cache...")
    torch.hub.set_dir('models/midas')
    torch.hub.load("intel-isl/MiDaS:master", "MiDaS_small", trust_repo=True)
    torch.hub.load("intel-isl/MiDaS:master", "transforms", trust_repo=True)
    print("MiDaS model successfully cached.")
