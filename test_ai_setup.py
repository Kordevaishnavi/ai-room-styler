#!/usr/bin/env python3
"""
AI Setup Verification Script for Room Styler
Tests PyTorch installation, model downloads, and AI pipeline functionality
"""

import sys
import os
import json
import time
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

def test_room_styler_script():
    """Test the room styler Python script"""
    print("\n🔍 Testing Room Styler AI Pipeline...")
    
    # Check if script exists
    script_path = Path("src/python/room_styler.py")
    if not script_path.exists():
        print(f"❌ Script not found: {script_path}")
        return False
    
    # Check for test images
    tmp_dir = Path("tmp")
    test_images = list(tmp_dir.glob("*.png"))
    
    if not test_images:
        print("❌ No test images found in tmp/ directory")
        return False
    
    test_image = test_images[0]
    output_path = tmp_dir / "ai_test_output.png"
    
    print(f"📸 Using test image: {test_image}")
    print("🚀 Running AI pipeline (this may take several minutes on first run)...")
    
    start_time = time.time()
    
    # Run the room styler script
    import subprocess
    try:
        result = subprocess.run([
            sys.executable, str(script_path), 
            str(test_image), "Modern", str(output_path)
        ], capture_output=True, text=True, timeout=1800)  # 30 minute timeout
        
        end_time = time.time()
        duration = end_time - start_time
        
        if result.returncode == 0:
            try:
                # Parse JSON output
                output_data = json.loads(result.stdout.strip())
                print(f"✅ AI pipeline completed in {duration:.1f} seconds")
                print(f"✅ Caption: {output_data['caption']}")
                print(f"✅ Prompt: {output_data['prompt']}")
                print(f"✅ Output saved: {output_data['output_path']}")
                
                # Verify output file exists
                if Path(output_data['output_path']).exists():
                    print("✅ Output image file created successfully")
                    return True
                else:
                    print("❌ Output image file not found")
                    return False
                    
            except json.JSONDecodeError as e:
                print(f"❌ Failed to parse JSON output: {e}")
                print(f"Raw output: {result.stdout}")
                return False
        else:
            print(f"❌ Script failed with return code {result.returncode}")
            print(f"Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Script timed out (30 minutes)")
        return False
    except Exception as e:
        print(f"❌ Error running script: {e}")
        return False

def test_model_cache():
    """Check if models are cached"""
    print("\n🔍 Checking Model Cache...")
    
    import os
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
        
        # Return True if cache directory exists and has models
        return len(cached_models) > 0
            
    else:
        print("ℹ️  No Hugging Face cache found (models will download on first run)")
        return True  # This is not an error, just means first run

def main():
    """Run all tests"""
    print("🤖 Room Styler AI Setup Verification")
    print("=" * 50)
    
    # Change to project directory
    os.chdir(Path(__file__).parent)
    
    tests = [
        ("PyTorch Installation", test_pytorch),
        ("AI Dependencies", test_ai_dependencies),
        ("Model Cache", test_model_cache),
        ("Room Styler Pipeline", test_room_styler_script)
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
    
    if all_passed:
        print("\n🎉 All tests passed! Your AI setup is ready!")
        print("🚀 You can now run the Room Styler application.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        print("📖 Refer to AI_SETUP_GUIDE.md for troubleshooting.")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
