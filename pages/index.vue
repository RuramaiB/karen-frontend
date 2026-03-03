<template>
  <div class="font-sans">
    <!-- Navbar -->
    <header class="bg-white/95 backdrop-blur-md shadow-lg fixed top-0 w-full z-50 border-b border-blue-100">
      <div class="container mx-auto flex justify-between items-center px-4 lg:px-8 py-4">
        <div class="flex items-center space-x-3">
          <!-- <div class="w-14 h-14">
            <img src="/assets/logo.png" class="h-full w-full" alt="">
          </div> -->
          <h1 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Microsoft Teams Learning Platform
          </h1>
        </div>
        <div class="flex items-center space-x-4">
          <NuxtLink 
            to="/auth/signin" 
            class="px-4 py-2 text-[#464EB8] border-2 border-[#464EB8] rounded-lg hover:bg-[#464EB8] hover:text-white transition-all duration-300 font-medium"
          >
            Sign In
          </NuxtLink>
          <NuxtLink 
            to="/auth/signup" 
            class="max-md:hidden px-4 py-2 bg-[#464EB8] text-white rounded-lg hover:bg-[#3d44a2] transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            Join Platform
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero pt-28 pb-20 bg-gray-50 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div class="absolute top-3/4 right-1/4 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div class="container mx-auto flex flex-wrap items-center justify-between px-4 lg:px-8 relative">
        <!-- Text Content -->
        <div class="w-full lg:w-1/2 mb-12 lg:mb-0 z-10">
          <div class="inline-flex items-center px-4 py-2 bg-[#464EB8]/10 rounded-full text-[#464EB8] text-sm font-medium mb-6">
            <i class="fas fa-graduation-cap mr-2"></i>
            Advanced Proctoring Technology
          </div>
          
          <h1 class="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
            Ensuring <span class="text-[#464EB8]">Academic Integrity</span>
            <br />Through Innovation
          </h1>
          
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            Our cutting-edge proctoring system ensures examination integrity while empowering students to excel in their academic journey.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <button class="group px-8 py-4 bg-[#464EB8] text-white rounded-lg hover:bg-[#3d44a2] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <i class="fas fa-rocket mr-2 group-hover:animate-pulse"></i> 
              Get Started Now
            </button>
          </div>
        </div>

        <!-- Image Section -->
        <div class="w-full lg:w-1/2 flex justify-center relative z-10">
          <div class="relative">
            <div class="absolute inset-0 bg-blue-400 rounded-3xl blur-3xl opacity-10 transform rotate-6"></div>
            <div class="w-full h-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex items-center justify-center p-8">
                <div class="text-center">
                    <div class="w-20 h-20 bg-[#464EB8] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <i class="fas fa-users text-4xl text-white"></i>
                    </div>
                    <p class="text-2xl font-bold text-gray-800">Microsoft Teams</p>
                    <p class="text-gray-500">For Education</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section id="about" class="py-20 bg-white">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex flex-wrap items-center justify-between">
          <div class="w-full lg:w-1/2 mb-12 lg:mb-0">
            <div class="relative">
              <div class="absolute inset-0 bg-blue-400 rounded-3xl blur-2xl opacity-10 transform -rotate-6"></div>
               <div class="w-full aspect-video bg-[#464EB8] rounded-xl shadow-xl flex items-center justify-center">
                   <i class="fas fa-shield-alt text-8xl text-white opacity-20"></i>
               </div>
            </div>
          </div>
          
          <div class="w-full lg:w-1/2 space-y-8 lg:pl-12">
            <div class="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium">
              <i class="fas fa-lightbulb mr-2"></i>
              Innovative Technology
            </div>
            
            <h2 class="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Advanced Proctoring for 
              <span class="text-[#464EB8]">Modern Education</span>
            </h2>
            
            <p class="text-lg text-gray-600 leading-relaxed">
              We deliver a comprehensive proctoring solution that combines AI-powered monitoring, real-time analytics, and seamless integration to ensure examination integrity.
            </p>
            
            <div class="grid gap-6">
              <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 border border-gray-100">
                <div class="w-12 h-12 flex justify-center items-center bg-[#464EB8] text-white rounded-lg shadow-lg">
                  <i class="fas fa-user-check"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 mb-1">AI-Powered Identity Verification</h3>
                  <p class="text-gray-600 text-sm">Advanced facial recognition ensures secure student identification</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 border border-gray-100">
                <div class="w-12 h-12 flex justify-center items-center bg-[#464EB8] text-white rounded-lg shadow-lg">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 mb-1">Real-Time Analytics & Reporting</h3>
                  <p class="text-gray-600 text-sm">Comprehensive dashboards provide complete examination oversight</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner Section -->
    <section class="relative bg-[#464EB8] overflow-hidden">
      <div class="relative py-20 px-4 sm:px-6 md:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-100 text-sm font-medium mb-6">
            <i class="fas fa-shield-alt mr-2"></i>
            Trusted by Educational Institutions
          </div>
          
          <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Secure Your Exams with 
            <br class="hidden sm:block" />
            Advanced Proctoring
          </h2>
          
          <p class="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join educational institutions worldwide that trust our platform to maintain academic integrity and empower student success.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink 
              to="/auth/signup"
              class="group px-8 py-4 bg-white text-[#464EB8] rounded-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i class="fas fa-rocket mr-2 group-hover:animate-pulse"></i>
              Start Free Trial
            </NuxtLink>
            <button class="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
              <i class="fas fa-phone mr-2"></i>
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
    <footerComp/>
  </div>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";

.hero {
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%);
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-500 {
  animation-delay: 0.5s;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>