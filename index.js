const buffrem = {
  ability: 0,
  empathy: 0,
  union: 0,
  union_mechanic: 0,
  monster_vonbon: 0,
  monster_arkarium: 0,
  monster_will: 0,
}
const cooltimeReduce = {
  mercedes: 0,
  hat: 0,
}
const limits = {
  ability: 50,
  empathy: 100,
  union: 40,
  union_mechanic: 25,
  monster_vonbon: 5,
  monster_arkarium: 5,
  monster_will: 6,
  mercedes: 6,
  hat: 9,
}

const defaultDuration = 110
const defaultCooltime = 180

const input_ids = ["ability", "empathy", "union", "union_mechanic", "monster_vonbon", "monster_arkarium", "monster_will", "mercedes", "hat"]

function assertInput(name, value) {
  if(0 <= value && value <= limits[name]) {
    return
  }
  throw "잘못된 입력입니다."
}

let durationBar
let durationSecs
let cooltimeBar
let cooltimeSecs
let summaryView

function updateGraph() {
  let buffremValue = buffrem.ability + Math.floor(buffrem.empathy / 10)
                      + buffrem.union + buffrem.union_mechanic
                      + buffrem.monster_vonbon + buffrem.monster_arkarium + buffrem.monster_will
  let buffDuration = defaultDuration * (1 + buffremValue / 100)
  let cooltime = defaultCooltime   * (1 - cooltimeReduce.mercedes / 100) - cooltimeReduce.hat

  const widthMultiplier = 90
  let maxValue = Math.max(buffDuration, cooltime)
  durationBar.style.width = `${buffDuration / maxValue * widthMultiplier}%`
  durationSecs.innerHTML = `${Math.round(buffDuration * 100) / 100}초`
  cooltimeBar.style.width = `${cooltime / maxValue * widthMultiplier}%`
  cooltimeSecs.innerHTML = `${Math.round(cooltime * 100) / 100}초`

  if(buffDuration < cooltime) {
    summaryView.style.visibility = 'visible'
    let i
    for(i = 1; i < 64; i++) {
      if(defaultDuration * (1 + (buffremValue + i) / 100) >= cooltime) break
    }
    summaryView.innerHTML = `지속시간이 쿨타임보다 ${Math.round((cooltime-buffDuration) * 100) / 100}초 부족합니다.`
                          + ` 버프 지속시간 ${i}% 추가 증가 시 지속시간이 쿨타임보다 길어집니다.`
  }
  else {
    summaryView.style.visibility = 'collapsed'
    summaryView.innerHTML = ""
  }
}

window.onload = () => {
  durationBar = document.getElementById("graph-duration-bar")
  durationSecs = document.getElementById("graph-duration-secs")
  cooltimeBar = document.getElementById("graph-cooltime-bar")
  cooltimeSecs = document.getElementById("graph-cooltime-secs")
  summaryView = document.getElementById("summary")

  for(const id of input_ids) {
    document.getElementById(id).addEventListener('change', (event) => {
      try {
        let name = event.target.id
        let value = Number(event.target.value)
        assertInput(name, value)
        switch(name) {
          case "ability":
          case "empathy":
          case "union":
          case "union_mechanic":
            buffrem[name] = value
            break
          case "mercedes":
          case "hat":
            cooltimeReduce[name] = value
            break
          case "monster_vonbon":
          case "monster_arkarium":
          case "monster_will":
            buffrem[name] = event.target.checked ? value : 0
        }
      }
      catch(e) {
        console.log("Invalid input")
      }
      updateGraph()
    })
  }
  updateGraph()
}

