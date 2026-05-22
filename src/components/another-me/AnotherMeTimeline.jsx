'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Galaxy from '@/components/ui/Galaxy'
import GradientText from '@/components/ui/GradientText'
import { useVisibilityLoader, useDeviceType } from '@/hooks/useVisibilityLoader'
import styles from './AnotherMeTimeline.module.css'

const SplineScene = dynamic(
  () => import('@splinetool/react-spline'),
  { ssr: false, loading: () => <div className={styles.splineFallback} /> }
)

const milestones = [
  {
    id: 1, year: '2018', era: 'Lần đầu tiên tôi tiếp cận với nghề',
    color: '#a855f7',
    headline: 'Junior Level',
    company: 'MEGAHOME CO., LTD - Sản xuất đồ gia dụng',
    achievement: '- Là nơi tôi bắt đầu sự nghiệp của mình trong lĩnh vực Digital Marketing.\n - Tại đây, tôi không được cầm tay chỉ việc nhưng cũng nhờ đó mà học hỏi được nhiều hơn về nghề.\n - Và cũng là lần đầu tiên tôi được tiếp cận tới Paid Ads',
    stat: { value: 'Thành công của tôi', label: 'CÓ KỸ NĂNG và đặc biệt là thành công vang dội của sản phẩm X-MOP Pro' }
  },
  {
    id: 2, year: '2019', era: 'PHÁT TRIỂN KỸ NĂNG',
    color: '#6366f1',
    headline: 'Executive Level',
    company: 'Phúc Ngọc Tân - Production Agency',
    achievement: '- Sếp của tôi là một Stylist nổi tiếng, tại đây tôi cũng tự mày mò để phát triển kỹ năng chuyên môn và cũng tại đây tôi được phát triển mạnh mẽ về Creative.\n - Vì là Công ty nhỏ nên hầu hết tất cả các khâu tôi đều phải làm từ sản xuất hình ảnh, banner, retouch, edit video,... nhưng với người đam mê học hỏi như tôi thì đó là một cơ hội, không phải thử thách.',
    stat: { value: 'Thành công của tôi', label: '- Có thêm kỹ năng về Creative \n - Được tiếp cận với Performance Marketing \n - Giải quyết được hàng tồn kho của ANDUONGHOME (Home Furniture) thông qua Digital Ads' }
  },
  {
    id: 3, year: '2020', era: 'Đứng trên vai người khổng lồ',
    color: '#a855f7',
    headline: 'Leader Level',
    company: 'Hoan My Medical Corporation - Healthcare',
    achievement: '- Lần đâu tiên tôi được làm việc trong một tập đoàn lớn với quy trình bài bản, tại đây tôi được tiếp xúc với nhiều chuyên gia giỏi và được học hỏi rất nhiều từ họ. \n - Tôi đã có cơ hội để áp dụng những gì mình đã học được vào thực tế và đạt được những kết quả đáng kể cho công ty.\n - Đây cũng là nơi tôi cho tôi được làm việc với góc độ quản lý. \n- Tôi phát triển mạnh mẽ hơn về kỹ năng chuyên ngành và đặc biệt trong mảng SEO.',
    stat: { value: 'Thành công của tôi', label: '- Đặc biệt nhất là trong thời điểm dịch COVID-19, tôi đã góp phần cho thành công trong việc truyền thông xét nghiệm PCR quan trọng thế nào và ở TP. HCM trong thời điểm block down có lẽ Hoàn Mỹ là đơn vị tiên phonng thực hiện. \n- Cùng một công thức, tôi đã clone cho các chuyên khoa mũi nhọn khác như "Khám bệnh Tại nhà", "Nội soi tiêu hóa An thần"... \n - Và rất nhiều bài viết của chuyên khoa khác On Top Google (Organic)' }
  },
  {
    id: 4, year: '2022', era: 'Chuyển mình',
    color: '#818cf8',
    headline: 'Senior Level',
    company: 'VNG Corporation - ZingMP3, Baomoi',
    achievement: '- Lần đầu tiên tiếp cận App Marketing, một lĩnh vực đầy tiềm năng.\n - Tại đây tôi được làm việc với lượng data khổng lồ và học được cách vận hành các chiến dịch quảng cáo quy mô lớn, đặc biệt là trong mảng User Acquisition cho ứng dụng ZingMP3, Baomoi.\n - Tôi có cơ hội được đi sâu hơn về dự án Performance Marketing và đặc biệt là Paid Ads, tôi đã học được cách tối ưu hóa chiến dịch quảng cáo để đạt được hiệu quả tốt nhất. \n - Tôi được học hỏi mạnh mẽ hơn trong việc structure Campaign, hệ thống hóa các Metrics từ Paid Media.',
    stat: { value: 'Thành công của tôi', label: '- Góp phần trong việc Planing làm sao để khắc phục "Learning Phase" của Digital Platforms.\n - Hoàn thành KPIs committed chỉ trong 9 tháng.\n - Giảm CPI (Cost Per Install) x2 so với trước đó' }
  },
  {
    id: 5, year: '2023', era: 'Tiếp tục chuyển mình',
    color: '#ec4899',
    headline: 'Senior Leader Level',
    company: 'Yes4All Holding - Vendor of Amazon',
    achievement: '- Là nơi cho tôi những foundations về Technical skills, Automation skills.\n - Là nơi tôi được tiếp cận với một lĩnh vực mới khác là E-Commerce, đặc biệt là Amazon (tiên phong trong lĩnh vực này).\n - Là nơi tôi phải làm thuần Performance Marketing, những quyết định đều phải dựa trên số liệu, không cảm tính.\n - Là nơi tôi phát triển mạnh mẽ về kỹ năng phân tích, visualize dữ liệu của mình.\n - Và nhiều thứ khác để tôi có thể phù hợp hơn với xu hướng Digital Marketing trong thời đại mới.',
    stat: { value: 'Thành công của tôi', label: '- 12 TRIỆU ĐÔ là GMV mà cả team của tôi đã đạt được trong đó bao gồm hơn 60 product groups và ~1K variables.\n - ACOS ~20% và là năm đầu tiên mà team tôi bán hàng trên Amazon, Walmart, Wayfair chính thức. \n - Đưa hơn 300+ SKUs ra thị trường khác như Nhật Bản, EU, Tây Ban Nha,...' }
  },
  {
    id: 6, year: '2025', era: 'Tạo giá trị',
    color: '#ec4899',
    headline: 'Manager Level',
    company: 'MetaMed Corporation - Healthcare Ecosystem',
    achievement: '- Là nơi tôi dùng kỹ năng và kinh nghiệm của mình để tạo ra giá trị cho Khách hàng nói riêng, cho ngành Y tế nói chung.\n - Tại đây tôi phụ trách Digital các nhóm sản phẩm như HEDIMA (Healthcare Agency), YouMed (Healthcare App Booking), Doctor Workspace (Toolkits for Doctors), Y360 (Leaning platform for Pharmacists) với mục tiêu chung là "SHORTEN MEDICAL GAPS".',
    stat: { value: 'Thành công của tôi', label: '- Với HEDIMA tôi góp phần tăng trưởng Winrate từ 42% -> ~70% trong năm 2026 với Data Driven Strategies. Tôi xây dựng cho từng khách hàng hệ thống Report near Realtime (hourly) để theo dõi hiệu suất trực quan nhất.\n- Với YouMed, tôi vực dậy được SEO sau nhiều năm bỏ quên từ top 10 -> top 8 trong mảng Healthcare, xây dựng content phù hợp với SEO thời đại mới (bao gồm cả AIO và GEO). Riêng về AIO tăng trưởng x2 so với năm 2025.\n - Với Doctor Workspace và Y360, tôi đã xây dựng được công thức thành công cho việc Recruit Bác sĩ, Dược sĩ tham gia vào MetaMed Platforms bằng Automation Workflow.\n - Phối hợp hoàn thiện hệ thông Report cho tất cả platforms của Doanh nghiệp với mục tiêu "Quyết định nhanh dựa trên số liệu, không cảm tính".' }
  },
]

export default function AnotherMeTimeline() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const fiberTrackRef = useRef(null)
  const fiberLineRef = useRef(null)
  const fiberGlowRef = useRef(null)
  const rocketRef = useRef(null)
  const milestoneRefs = useRef([])
  const dotRefs = useRef([])
  const [fiberTop, setFiberTop] = useState(0)
  const [fiberHeight, setFiberHeight] = useState(0)
  const [dotYPositions, setDotYPositions] = useState([])
  const { ref: visibilityRef, isVisible } = useVisibilityLoader({ rootMargin: '200px' })
  const deviceType = useDeviceType()

  useEffect(() => {
    milestoneRefs.current = milestoneRefs.current.slice(0, milestones.length)
    dotRefs.current = dotRefs.current.slice(0, milestones.length)
  }, [])

  useEffect(() => {
    const updateFiberBounds = () => {
      const firstDot = dotRefs.current[0]
      const lastDot = dotRefs.current[dotRefs.current.length - 1]
      const wrapper = milestoneRefs.current[0]?.closest(`.${styles.milestonesWrapper}`)

      if (firstDot && lastDot && wrapper) {
        const wrapperRect = wrapper.getBoundingClientRect()
        const firstRect = firstDot.getBoundingClientRect()
        const lastRect = lastDot.getBoundingClientRect()

        const top = firstRect.top + firstRect.height / 2 - wrapperRect.top
        const bottom = lastRect.top + lastRect.height / 2 - wrapperRect.top
        const height = bottom - top

        if (height <= 0) return

        setFiberTop(top)
        setFiberHeight(height)

        const yPositions = dotRefs.current.map(dot => {
          if (!dot) return 0
          const rect = dot.getBoundingClientRect()
          return rect.top + rect.height / 2 - wrapperRect.top - top
        })
        setDotYPositions(yPositions)
      }
    }

    updateFiberBounds()
    const timer = setTimeout(updateFiberBounds, 100)
    window.addEventListener('resize', updateFiberBounds)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateFiberBounds)
    }
  }, [])

  useEffect(() => {
    let ctx
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const section = sectionRef.current
        const fiberLine = fiberLineRef.current
        const fiberGlow = fiberGlowRef.current
        const rocket = rocketRef.current

        if (fiberLine) {
          fiberLine.style.transformOrigin = 'top center'
          fiberLine.style.transform = 'scaleY(0)'
        }
        if (fiberGlow) {
          fiberGlow.style.transformOrigin = 'top center'
          fiberGlow.style.transform = 'translateX(-50%) scaleY(0)'
        }
        if (rocket) {
          gsap.set(rocket, { y: 0, opacity: 0 })
        }

        gsap.fromTo(headingRef.current, { y: 30, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 30%',
            toggleActions: 'play none none none',
          }
        })

        milestoneRefs.current.forEach((item, i) => {
          if (!item) return
          const leftCol = item.querySelector(`.${styles.colLeft}`)
          const rightCol = item.querySelector(`.${styles.colRight}`)
          const statEl = item.querySelector(`.${styles.statValue}`)
          const dot = dotRefs.current[i]
          const dotY = dotYPositions[i] ?? 0
          const prevY = i > 0 ? (dotYPositions[i - 1] ?? 0) : 0

          ScrollTrigger.create({
            trigger: item,
            start: 'top 50%',
            end: 'top 40%',
            scrub: 1,
            onEnter: () => {
              if (dot) {
                gsap.to(dot, {
                  scale: 1,
                  opacity: 1,
                  duration: 0.4,
                  ease: 'power2.out',
                })
              }

              if (fiberLine) {
                gsap.to(fiberLine, {
                  scaleY: fiberHeight > 0 ? dotY / fiberHeight : 0,
                  duration: 0.5,
                  ease: 'power2.out',
                })
              }
              if (fiberGlow) {
                gsap.to(fiberGlow, {
                  scaleY: fiberHeight > 0 ? dotY / fiberHeight : 0,
                  duration: 0.5,
                  ease: 'power2.out',
                })
              }

              if (rocket) {
                gsap.to(rocket, {
                  y: dotY,
                  opacity: 1,
                  duration: 0.5,
                  ease: 'power2.out',
                })
              }

              gsap.to(leftCol, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
              gsap.to(rightCol, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 })

              if (statEl && statEl.dataset.counted !== 'true') {
                statEl.dataset.counted = 'true'
                const text = statEl.textContent
                const numMatch = text.match(/[\d.]+/)
                if (numMatch) {
                  const target = parseFloat(numMatch[0])
                  const suffix = text.replace(numMatch[0], '')
                  const obj = { val: 0 }
                  gsap.to(obj, {
                    val: target,
                    duration: 1.2,
                    ease: 'power1.out',
                    onUpdate: () => {
                      statEl.textContent = (Number.isInteger(target) ? Math.floor(obj.val) : obj.val.toFixed(1)) + suffix
                    }
                  })
                }
              }
            },
            onLeaveBack: () => {
              if (dot) {
                gsap.to(dot, {
                  scale: 0,
                  opacity: 0,
                  duration: 0.3,
                  ease: 'power2.in',
                })
              }

              if (fiberLine) {
                gsap.to(fiberLine, {
                  scaleY: fiberHeight > 0 ? prevY / fiberHeight : 0,
                  duration: 0.3,
                  ease: 'power2.in',
                })
              }
              if (fiberGlow) {
                gsap.to(fiberGlow, {
                  scaleY: fiberHeight > 0 ? prevY / fiberHeight : 0,
                  duration: 0.3,
                  ease: 'power2.in',
                })
              }

              if (rocket) {
                gsap.to(rocket, {
                  y: prevY,
                  opacity: prevY === 0 ? 0 : 1,
                  duration: 0.3,
                  ease: 'power2.in',
                })
              }

              gsap.set(leftCol, { x: 20, opacity: 0 })
              gsap.set(rightCol, { x: -20, opacity: 0 })
            }
          })
        })
      }, sectionRef)
    }

    init()
    return () => ctx?.revert()
  }, [fiberHeight, dotYPositions])

  return (
    <section ref={(el) => { sectionRef.current = el; visibilityRef.current = el; }} id="timeline" className={styles.section}>
      {isVisible && <div className={styles.galaxyBg}>
        <Galaxy
          hueShift={280}
          density={deviceType === 'mobile' ? 0.4 : 1.0}
          glowIntensity={deviceType === 'mobile' ? 0.15 : 0.35}
          saturation={deviceType === 'mobile' ? 0.3 : 0.5}
          starSpeed={0.25}
          mouseRepulsion={false}
          twinkleIntensity={deviceType === 'mobile' ? 0.1 : 0.25}
          rotationSpeed={0.08}
          speed={deviceType === 'mobile' ? 0.5 : 1.0}
        />
      </div>}
      <div className={styles.inner}>
        <div ref={headingRef} className={styles.heading}>
          <span className={styles.headingLabel}>The Journey</span>
          <h2 className={styles.headingTitle}>Hành trình sự nghiệp</h2>
          <div className={styles.flareLine} />
        </div>

        <div className={styles.timelineContainer}>
          <div
            ref={fiberTrackRef}
            className={styles.fiberTrack}
            style={{ top: fiberTop, height: fiberHeight || 'auto' }}
          >
            <div ref={fiberLineRef} className={styles.fiberLine} />
            <div ref={fiberGlowRef} className={styles.fiberGlow} />
            <div ref={rocketRef} className={styles.rocketWrapper}>
              <div className={styles.rocketContainer}>
                {isVisible && <SplineScene
                  scene="https://prod.spline.design/xc5ykxFbQXgCsObK/scene.splinecode"
                />}
              </div>
            </div>
          </div>

          <div className={styles.milestonesWrapper}>
            {milestones.map((m, i) => (
              <div
                key={m.id}
                ref={el => milestoneRefs.current[i] = el}
                className={styles.milestoneRow}
              >
                <div className={styles.colLeft}>
                  <GradientText
                    colors={['#a855f7', '#6366f1', '#ec4899', '#a855f7']}
                    animationSpeed={4}
                    direction="horizontal"
                  >
                    <span className={styles.year}>{m.year}</span>
                  </GradientText>
                  <span className={styles.era}>{m.era}</span>
                  <span className={styles.headline}>{m.headline}</span>
                </div>

                <div className={styles.colCenter}>
                  <div
                    ref={el => dotRefs.current[i] = el}
                    className={styles.milestoneDot}
                  />
                </div>

                <div className={styles.colRight}>
                  <div className={styles.milestoneCard}>
                    <span className={styles.company}>{m.company}</span>
                    <p className={styles.achievement}>{m.achievement}</p>
                    <div className={styles.statBlock}>
                      <span className={styles.statValue} style={{ color: m.color }}>{m.stat.value}</span>
                      <span className={styles.statLabel}>{m.stat.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
