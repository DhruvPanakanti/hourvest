export default function Footer() {
    return (
      <footer className="relative bg-primary-500 text-white p-8 font-sans overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="relative pt-8 lg:pt-16 lg:mt-16">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30 -lg:!opacity-0"></div>
            <div className="flex flex-col items-start justify-start lg:flex-row lg:justify-between lg:gap-x-8">
              <div className="w-full shrink-0 lg:w-1/3 mb-6 lg:mb-0 relative z-10">
                <div className="text-3xl lg:text-4xl font-normal">
                  <span className="italic font-bold text-dark-2">Appeal,Accept,Assist: </span>
                  <span className="italic font-bold text-dark-2">Your Time Bank Community.</span>
                </div>
                
                {/* Added text on the left */}
                <div className="mt-6 text-dark-2">
                  <p>Join our growing community of Time Bank where appeal, acceptance, and assistance come together. Explore the Obligation that bring people together.</p>
                </div>
              </div>
  
              <div className="w-full pt-6 lg:pt-3">
                <div className="flex flex-col lg:items-end"> {/* Changed from grid to flex column with items-end */}
                  <div className="mt-6 lg:mt-0 relative z-10 text-right"> {/* Added text-right */}
                    <div className="text-dark-2 font-semibold">Address</div>
                    <a className="text-dark-2 flex flex-col items-end justify-start mt-3" href="#" target="_blank" rel="noopener noreferrer"> {/* Changed items-start to items-end */}
                      <span className="block">Kompally</span>
                      <span className="block">Hyderabad, Telangana</span>
                    </a>
                  </div>
      
                  <div className="mt-6 lg:mt-6 relative z-10 text-right"> {/* Added text-right */}
                    <div className="text-dark-2 font-semibold">Contact</div>
                    <div className="text-dark-2 flex flex-col items-end justify-start mt-3"> {/* Changed items-start to items-end */}
                      <a className="hover:text-white/60 transition block" href="tel:+31 (0)20 330 06 70">+91 8074987228</a>
                      <a className="hover:text-white/60 transition block" href="mailto:info@tobacco.nl">dhruvpanakanti@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden w-full md:top-auto md:bottom-1/4 mt-12">
            <div className="max-w-full mx-auto">
              <div className="flex justify-center text-[100px] sm:text-[150px] md:text-[200px] lg:text-[275px] font-bold opacity-40 -mb-16 sm:-mb-20 md:-mb-16 lg:-mb-20">
                {'HOURVEST'.split('').map((letter, index) => (
                  <span 
                    key={index}
                    className="inline-block transition-transform duration-300 hover:scale-110 hover:opacity-70 cursor-default"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Added copyright text */}
          <div className="relative z-10 text-center pt-8 mt-8 border-t border-white/20">
            <p className="text-dark-2 text-sm">© 2025 Hourvest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }