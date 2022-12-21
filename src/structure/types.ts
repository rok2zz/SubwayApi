export interface train {
    beginRow?: number
    endRow?: number
    curPage?: number
    pageRow?: number

    rowNum: number
    selectedCount: number
    totalCount: number
    subwayId: string
    subwayNm?: string

    updnLine: string
    trainLineNm: string
    subwayHeading: string

    statnFid: string
    statnTid: string
    statnId: string
    statnNm?: string

    trainCo?: string
    ordKey: string

    subwayList: string
    statnList: string

    barvlDt: string
    btrainSttus?: string
    btrainNo: string
    bstatnId: string
    bstatnNm: string
    recptnDt: string

    arvlMsg2: string
    arvlMsg3: string
    arvlCd: number
}