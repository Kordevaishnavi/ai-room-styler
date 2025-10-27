#!/usr/bin/env python3
"""
Quick AI Setup Verification Script for Room Styler
Fast tests without running the full AI pipeline
"""

import sys
import os
from pathlib import Path

def test_pytorch():
    """Test PyTorch installation and CUDA availability"""
    print("🔍 Testing PyTorch Installation...")
    
    try:
        import torch
        print(f"✅ PyTorch version: {torch.__version__}")
        print(f"✅ CUDA version: {torch.version.cuda}")
        print(f"✅ CUDA available: {torch.cuda.is_available()}")
        
        if torch.cuda.is_available():
            print(f"✅ GPU count: {torch.cuda.device_count()}")
            print(f"✅ Current device: {torch.cuda.get_device_name(0)}")
        else:
            print("ℹ️  Running on CPU (GPU acceleration not available)")
        
        return True
    except ImportError as e:
        print(f"❌ PyTorch import failed: {e}")
        return False

def test_ai_dependencies():
    """Test AI-related package imports"""
    print("\n🔍 Testing AI Dependencies...")
    
    packages = {
        'transformers': 'Hugging Face Transformers',
        'diffusers': 'Diffusers for Stable Diffusion',
        'PIL': 'Pillow for image processing',
        'accelerate': 'Accelerate for model optimization'
    }
    
    success = True
    for package, description in packages.items():
        try:
            __import__(package)
            print(f"✅ {description}")
        except ImportError as e:
            print(f"❌ {description}: {e}")
            success = False
    
    return success

def test_model_cache():
    """Check if models are cached"""
    print("\n🔍 Checking Model Cache...")
    
    cache_dir = Path.home() / ".cache" / "huggingface" / "hub"
    
    if cache_dir.exists():
        cached_models = list(cache_dir.glob("models--*"))
        print(f"✅ Found {len(cached_models)} cached models")
        
        # Look for specific models
        blip_model = any("vit-gpt2-image-captioning" in str(m) for m in cached_models)
        sd_model = any("stable-diffusion-2-1" in str(m) for m in cached_models)
        
        if blip_model:
            print("✅ BLIP model cached")
        else:
            print("ℹ️  BLIP model not cached (will download on first run)")
            
        if sd_model:
            print("✅ Stable Diffusion model cached")
        else:
            print("ℹ️  Stable Diffusion model not cached (will download on first run)")
        
        return len(cached_models) > 0
            
    else:
        print("ℹ️  No Hugging Face cache found (models will download on first run)")
        return True  # This is not an error, just means first run

def test_script_exists():
    """Check if the room styler script exists and has correct structure"""
    print("\n🔍 Testing Room Styler Script...")
    
    script_path = Path("src/python/room_styler.py")
    if not script_path.exists():
        print(f"❌ Script not found: {script_path}")
        return False
    
    print(f"✅ Script found: {script_path}")
    
    # Check for test images
    tmp_dir = Path("tmp")
    if not tmp_dir.exists():
        print("❌ tmp/ directory not found")
        return False
    
    test_images = list(tmp_dir.glob("*.png"))
    if not test_images:
        print("❌ No test images found in tmp/ directory")
        return False
    
    print(f"✅ Found {len(test_images)} test images")
    
    # Check if we have previous AI output
    ai_outputs = [f for f in tmp_dir.glob("*ai*.png")]
    if ai_outputs:
        print(f"✅ Found {len(ai_outputs)} AI-generated images (previous runs)")
    
    return True

def test_imports_work():
    """Test that we can import the AI models without errors"""
    print("\n🔍 Testing Model Imports...")
    
    try:
        print("Loading transformers...")
        from transformers import pipeline
        print("✅ Transformers loaded")
        
        print("Loading diffusers...")
        from diffusers import StableDiffusionImg2ImgPipeline
        print("✅ Diffusers loaded")
        
        print("Loading PIL...")
        from PIL import Image
        print("✅ PIL loaded")
        
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def main():
    """Run all tests"""
    print("🤖 Room Styler AI - Quick Setup Check")
    print("=" * 50)
    
    # Change to project directory
    os.chdir(Path(__file__).parent)
    
    tests = [
        ("PyTorch Installation", test_pytorch),
        ("AI Dependencies", test_ai_dependencies),
        ("Model Cache", test_model_cache),
        ("Script & Files", test_script_exists),
        ("Model Imports", test_imports_work)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    
    all_passed = True
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if not success:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 All tests passed! Your AI setup is ready!")
        print("🚀 The AI pipeline is ready to use.")
        print("💡 Run the full test with: python test_ai_setup.py")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        print("📖 Refer to AI_SETUP_GUIDE.md for troubleshooting.")
    
    # Additional info
    print("\n📋 Next Steps:")
    print("   1. Run 'npm run dev' to start the web application")
    print("   2. Upload a room image and select a style")
    print("   3. The AI will generate a styled version")
    print("   4. First generation may take 5-15 minutes (model loading)")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
