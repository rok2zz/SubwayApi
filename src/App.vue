<template>
	<div :class="$style.index">
		<div :class="[$style.container, 'general-font-color', 'general-border-color']">
			<div :class="$style.title">
				<span>실시간 지하철 도착정보 조회 시스템</span>
			</div>
			<!-- 검색 -->
			<div :class="$style.search">
				<input v-on:keydown="keydownHandler" :class="[$style.input, '.general-font-color-input', 'general-border-bottom-color']" type="text" placeholder="서울역" v-model="stationName">
				<span>
					<button :class="[$style.searchBtn, 'general-font-color-btn', 'general-background-color-btn']" v-on:click="updateStationName">검색</button>
				</span>
			</div>

			<!-- 정보 -->
			<div v-if="isLoaded()" :class="$style.info">
				<div v-for="(item, index) in transferLine" :key="index" :class="$style.line">
					<span :class="$style.name">{{ getLineName(item) }}</span>
					<div :class="$style.location">
						<div v-for="(item2, index2) in info" :key="index2" :class="[getTrainStyle(item, item2), $style.train]">
							<div v-if="item2.updnLine == '하행'">
								<div :class="$style.info">
									{{ item2.arvlMsg2 }}
								</div>
								<div :class="[$style.name, 'general-font-color-btn', 'line-color-level-' + item]">
									<span :class="$style.up">&lt; {{ item2.btrainNo }}</span>
								</div>
							</div>
							<div v-else>
								<div :class="[$style.name, 'general-font-color-btn','line-color-level-' + item]">
									<span :class="$style.down">{{ item2.btrainNo }} ></span>
								</div>
								<div :class="$style.info">
									{{ item2.arvlMsg2 }}
								</div>
							</div>
						</div>
						<div :class="[$style.bar, 'line-color-level-' + item]"></div>
					</div>
				</div>
			</div>

			<div v-else :class="$style.fail">
				<span class="general-font-color-fail">불러오기에 실패했습니다.</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import '@/assets/scss/theme.scss';

* {
	margin: 0;
	padding: 0;

	box-sizing: border-box;
}
</style>

<style lang="scss" module>
.index {
	> .container {
		width: calc(100% - 48px);
		max-width: 800px;

		padding: 12px;
		margin: 0 auto;
		margin-top: 32px;

		font-size: 13px;

		border-width: 2px;
		border-style: solid;
		border-radius: 7px;

		> .title {
			padding: 12px 0px 8px 8px;
		}

		> .search {
			width: 100%;

			display: flex;

			padding-bottom: 32px;

			> .input {
				width: 100%;

				padding: 6px;

				font-size: 24px;

				border: none;
				border-bottom-width: 1px;
				border-bottom-style: solid;
			}

			> span {
				> .searchBtn {
					width: 60px;
					height: 40px;

					margin-left: 12px;
					
					font-size: 18px;
					font-weight: bold;

					border: none;
					border-radius: 5px;
					
					cursor: pointer;
				}
			}
		}

		> .info {
			padding: 32px 0px;
			
			> .line {

				> .name {
					width: 100%;
				}

				> .location {
					height: 80px;

					display: flex;
					align-items: center;
					position: relative;

					> .train {
						width: 50px;

						position: absolute;

						font-size: 10px;
						font-weight: bold;

						text-align: center;

						> div {

							> .info {
							}

							> .name {
								width: 100%;
								height: 20px;

								position: relative;


								> .up {
									position: absolute;
									top: 3px;
									left: 7px;
								}

								> .down {
									position: absolute;
									top: 3px;
									right: 7px;
								}
							}		
						}
					}

					> .bar {
						width: 100%;
						height: 4px;
					}
				}
			}
		}

		> .fail {
			padding: 32px 0px;
			
			text-align: center;
		}
	}
}

</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { train } from './structure/types';
import axios from 'axios'

@Component
export default class App extends Vue {
	zeroNum: number = 0
	transferLine: string[] = []
	stationName: string = ""
	queryName: string = ""
	info: train[] = [] as train[]

	created() {
		this.loadApi("서울")
	}

	mounted() {
		this.loadApi("서울")

		this.$router.push({query: {station: "서울"}});
	}

	loadApi(station: string) {
		var vm = this
		axios.get('http://swopenapi.seoul.go.kr/api/subway/%EC%A7%80%ED%95%98%EC%B2%A0API%ED%82%A4/json/realtimeStationArrival/0/20/' + station)
			.then(function(response) {
				vm.info = response.data.realtimeArrivalList
				vm.transferLine = vm.info[0]?.subwayList.split(",")
			})
			.catch(function(error) {
				alert('error')
			})
	}

	isLoaded(): boolean {
		return this.info != null
	}

	countTransferLine() {
		var list = this.info[0]?.subwayList

		this.transferLine = list?.split(',')		
	}

	getQueryName() {
		this.stationName = this.stationName.trim()
		this.queryName = ""

		var name = this.stationName.split("")

		if (name[name.length - 1] == "역") {
			for (var i = 0; i<name.length - 1; i++) {
				this.queryName += name[i]
			}
		} else {
			for (var i = 0; i<name.length; i++) {
				this.queryName += name[i]
			}
		}
	}

	updateStationName() {
		if (this.$route.query.station == this.stationName) return

		this.getQueryName()

		if (this.stationName == "") {
			if (this.$route.query.station == "서울") return 
			
			this.queryName = "서울"
			this.$router.push({query: {station: "서울"}});

			return
		}

		this.$router.push({query: {station: this.stationName}});
	}

	keydownHandler(e: KeyboardEvent) {
		if (e.key == "Enter") {
			this.updateStationName()
		}
	}

	getLineName(lineCode: string): string {
		switch (lineCode) {
			case "1001": return "1호선"
			case "1002": return "2호선"
			case "1003": return "3호선"
			case "1004": return "4호선"
			case "1005": return "5호선"
			case "1006": return "6호선"
			case "1007": return "7호선"
			case "1008": return "8호선"
			case "1009": return "9호선"
			case "1063": return "경의중앙선"
			case "1065": return "공항철도"
			case "1067": return "경춘선"
			case "1075": return "수인분당선"
			case "1077": return "신분당선"
			case "1091": return "자기부상"
			case "1092": return "우이신설선"
			default: return ""
		}
	}

	getTrainStyle(lineCode: string, item: train): string {
		var style = ""

		if (lineCode != item.subwayId) {
			style += "display: none;" + " "
		}

		if (item.updnLine == "하행") {
			style += "bottom: 55px;" + " "
		}

		if (item.arvlMsg2.split("")[0] == "전") {
			style += "left: 50%;" + " "
		}


		return style
	}

	@Watch('$route.query')
	updateSubway() {
		this.loadApi(this.queryName)
	}
}
</script>
